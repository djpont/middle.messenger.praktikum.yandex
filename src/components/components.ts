import {EventBus} from "~src/modules/event-bus";
import {Fn} from "~src/modules/functions";

// Базовый компонент (аналог Block из теории Практикума)

// Возможные действия с базовым компонентом
export const EVENTS = {
	init: "component:init", // Инициализация
	render: "component:render", // Рендер
	updateProp: "component:update", // Обновление пропсов
	updateChildren: "component:updateChildren", // Обновление чилдренов
}

// Тип данных для чилдренов
export type ComponentChildrenData = Record<string, Component[]>;

export type EventsType = Record<string, Fn<unknown> | Fn<unknown>[]>

// Тип данных для пропсов
export type ComponentPropsData = {
	children?: ComponentChildrenData;
	events?: EventsType;
	[key: string]: unknown;
};

// Класс базового компонента
export default abstract class Component<PropsType extends ComponentPropsData = ComponentPropsData> {

	// Делаем действия публичными
	public static readonly EVENTS = EVENTS;

	// Список всех компонентов - используется для поиска родителя при уничтожении
	private static readonly _allComponents: Component[] = [];

	private _document: HTMLElement; // Тут хранится DOM-дерево компонента
	public readonly eventBus: EventBus;
	public readonly props: PropsType; // Основные пропсы (чилдрены отделяются)
	public children: ComponentChildrenData;    // Чилдрены (массивы компонентов)

	// Холдеры для чилдренов
	// Холдер - это HTML-элемент в шаблоне компонента, изначально пустой,  куда добавлятся чилдрены
	private _childrenHolders: Record<string, HTMLElement>;

	protected constructor(props: PropsType) {
		// Добавляем экземпляр в список всех компонентов
		Component._allComponents.push(this);

		// Добавляем EventBus и регистрируем базовые события
		this.eventBus = new EventBus();
		this._registerEvents();

		// Создаем пустой прокси объект для чилдренов
		// Пустой, потому что чилдрены должны быть созданы после рендера компонента
		this.children = this._makeChildrenObjectProxy({});

		// Делаем пропсы прокси
		this.props = this._makePropsProxy(props) as PropsType;

		// Вызываем инициализацию компонента
		this.eventBus.emit(Component.EVENTS.init);

		// Вырезаем чилдренов из пропсов и вставляем  чилдрены в элемент
		Object.assign(this.children, this._getChildrenFromProps(props));

		// Теперь добавляем переданные евенты
		this._addEvents(this.props.events as EventsType);
	}

	private _addEvents(events: EventsType = {}){
		Object.entries(events).forEach(([HtmlAction, eventsArray])=>{
			if(!(eventsArray instanceof Array)){
				eventsArray=[eventsArray];
			}
			eventsArray.forEach(event => {
				this.target().addEventListener(HtmlAction, event);
			});
		});
	}

	private _removeEvents(events: EventsType = {}){
		Object.entries(events).forEach(([HtmlAction, eventsArray])=>{
			if(!(eventsArray instanceof Array)){
				eventsArray=[eventsArray];
			}
			eventsArray.forEach(event => {
				this.target().removeEventListener(HtmlAction, event);
			});
		});
	}

	// Метод для отделения children от пропсов (вырезаем из пропсов и возвращаем отдельно)
	private _getChildrenFromProps(props: ComponentPropsData): ComponentChildrenData {
		const children = (props.children !== undefined) ? props.children : {};
		delete props.children;
		return children;
	}

	// Регистрируем базовые события для Event Bus
	private _registerEvents(): void {
		this.eventBus.on(Component.EVENTS.init, this._init.bind(this));
		this.eventBus.on(Component.EVENTS.render, this._render.bind(this));
		this.eventBus.on(Component.EVENTS.updateProp, this.updateProp.bind(this));
		this.eventBus.on(Component.EVENTS.updateChildren, this.updateChildren.bind(this));
	}

	// Метод инициализации элемента
	private _init(): void {
		// Метод для поиска холдеров в шаблоне, вызывается сразу после рендера,
		// когда ещё не добавлены дочерние элементы
		const getTemplateHolders = (): Record<string, HTMLElement> => {
			const holders: Record<string, HTMLElement> = {};
			Array.from(this.document().querySelectorAll('[data-holder]'))
				.forEach(element => {
					const holder = element.getAttribute('data-holder');
					if (holder) {
						holders[holder] = element as HTMLElement;
					}
				});
			return holders;
		}
		// Вызываем рендер и собираем холдеры для будущего размещения чилдренов
		this.eventBus.emit(Component.EVENTS.render);
		this._childrenHolders = getTemplateHolders();
	}

	// Метод генерации HTML дерева по шаблону
	private _render = (): void => {
		this._document = this.render(this.props);
	}

	// Метод генерации HTML дерева по шаблону, должен быть описан в дочернем классе
	protected abstract render(data: ComponentPropsData): HTMLElement

	// Метод обновления пропса элемента, должен быть описан в дочернем классе
	protected abstract updateProp(prop: string): void

	// Метод получения пропса элемента, должен быть описан в дочернем классе
	protected abstract getProp(prop: string): { fromDom: boolean, value: unknown }

	// Метод обновления дочерних элементов
	public updateChildren(nestedUpdatesToo: boolean = false): void {
		// Сначала проверяем чилдренов на ошибки
		Object.entries(this.children).forEach(([holder]) => {
			if (this._childrenHolders[holder] === undefined) {
				console.error(this);
				throw new Error(`Неверный холдер ${holder}`);
			}
		})
		// Теперь перебираем холдеры и вставляем документ чилдрена
		Object.entries(this._childrenHolders).forEach(([holderName, holderElement]) => {
			holderElement.innerHTML = ''; // Удаляем содержимое и снавляем чилдренов
			if (this.children[holderName]) {
				Object.values(this.children[holderName]).forEach(child => {
					if (nestedUpdatesToo) {
						child.updateChildren(true);
					}
					holderElement.append(child.document());
				})
			}
		});
		// Если после нужно вызвать ещё метод, то его можно добавить в eventBus
	}

	// Метод возвращает HTML элемент
	public document(): HTMLElement {
		return this._document;
	}

	public setDocument(document: HTMLElement): void {
		this._document=document;
	}

	// Метод возвращает ключевой HTML элемент из всего документа
	// Может быть перезаписан в дочернем классе
	// По-умолчанию возвращает весь документ
	public target(): HTMLElement {
		return this.document();
	}

	// Прокси для основных пропсов элемента
	// Отличия: после изменения вызывается update компонента
	private _makePropsProxy(props: PropsType): PropsType {
		const proxySetting = {
			get: (target: ComponentPropsData, prop: string): unknown => {
				// Запрашиваем значение из DOM-элемента через метод
				const propFromDom = this.getProp(prop);
				if (propFromDom.fromDom) {
					return propFromDom.value;
				} else {
					return target[prop];
				}
			},
			set: (target: ComponentPropsData, prop: string, value: unknown): boolean => {
				if (target[prop] !== value) {
					if(prop==='events'){
						this._removeEvents(this.props.events as EventsType);
						this._addEvents(value as EventsType);
					}
					target[prop] = value;
					this.eventBus.emit(Component.EVENTS.updateProp, prop);
				}
				return true;
			},
			deleteProperty: (target: ComponentPropsData, prop: string): boolean => {
				delete target[prop];
				this.eventBus.emit(Component.EVENTS.updateProp, prop);
				return true;
			}
		};
		return new Proxy(props, proxySetting) as PropsType;
	}

	// Прокси для children элемента
	// Отличия: значения превращаются в прокси
	private _makeChildrenObjectProxy(props: ComponentChildrenData): ComponentChildrenData {
		const proxySetting = {
			get: (target: ComponentChildrenData, prop: string): unknown => {
				// Если ключ отсутствует, то создаём для него прокси с пустым массивом
				if (target[prop] === undefined) {
					this.children[prop] = this._makeChildrenArrayProxy([]);
					this.children[prop] = [];
				}
				return target[prop];
			},
			set: (
				target: ComponentChildrenData,
				prop: string,
				value: Component[]
			): boolean => {
				// Значение превращаем в прокси
				target[prop] = this._makeChildrenArrayProxy(value);
				return true;
			},
			deleteProperty: (target: ComponentChildrenData, prop: string): boolean => {
				delete target[prop];
				return true;
			}
		};
		return new Proxy(props, proxySetting) as ComponentChildrenData;
	}

	// Прокси для массивов внутри children элемента
	// Отличия: после изменения ничего не вызывается и значения хранятся как есть
	private _makeChildrenArrayProxy(props: Component[]): Component[] {
		const proxySetting: ProxyHandler<Component[]> = {
			get: (target: Component[], prop: string): unknown => {
				return target[prop];
			},
			set: (target: Component[], prop: string, value: unknown): boolean => {
				target[prop] = value;
				return true;
			},
			deleteProperty: (target: Component[], prop: string): boolean => {
				delete target[prop];
				return true;
			}
		};
		return new Proxy(props, proxySetting);
	}

	// Поиск элементов в дом дереве
	public subElements(selector: string): HTMLElement[] {
		return Array.from(this._document.querySelectorAll(selector));
	}

	// Поиск одного элемента в дом дереве
	public subElement(selector: string): HTMLElement {
		const elements = this.subElements(selector);
		if (elements.length === 0) {
			throw new Error(`Элемент ${selector} не найден`);
		}
		return elements[0];
	}

	// Метод уничтожения экземпляра
	public destroy(): void {
		// Убираем слушателей
		this.props.events={};
		// Рекурсивно вызываем уничтожение всех чилдренов
		Object.values(this.children).forEach(children => {
			for (const child of children) {
				child.destroy();
			}
		});
		// Очищаем дом-дерево
		this.document().remove();
		// Находим родителя и удаляем компонент из его чилдренов
		const parent = this.parent();
		if (parent.parent instanceof Component) {
			parent.parent.children[parent.holder].splice(parent.index, 1);
			// Удаляем компонент их списка всех компонентов
			Component._allComponents.splice(Component._allComponents.indexOf(this), 1);
			// Вызываем обновление чилдренов родителя
			parent.parent.updateChildren();
		}
	}

	// Метод поиска родительского компонента
	// Можно было бы хранить родителя в пропсах, но не хотелось связки в обе стороны делать
	public parent(): {
		parent: Component | boolean,
		holder: string,
		index: number
	} {
		let parentComponent: Component | boolean = false;
		let parentChildrenHolder: string | boolean = '';
		let parentChildrenIndex: number = -1;
		Component._allComponents.forEach(component => {
			Object.entries(component.children).forEach(([holder, children]) => {
				children.forEach(child => {
					if (child === this) {
						parentComponent = component;
						parentChildrenHolder = holder;
						parentChildrenIndex = children.indexOf(this);
					}
				})
			})
		});
		return {
			parent: parentComponent,
			holder: parentChildrenHolder,
			index: parentChildrenIndex
		}
	}

}
