import {EventBus} from "~src/components/event-bus";
import {Fn} from "~src/functions";

// Базовый компонент (аналог Block из теории Практикума)

// Возможные действия с базовым компонентом
export class EVENTS {
	static init = "component:init"; // Инициализация
	static registerBasementAction = "component:registerBasementAction"; // Регистр базового действия
	static render = "component:render"; // Рендер
	static update = "component:update"; // Обновление пропсов
	static updateChildren = "component:updateChildren"; // Обновление чилдренов
}

// Тип данных для чилдренов
export type ComponentChildrenData = Record<string, Component<ComponentPropsData>[]>;

// Тип данных для пропсов
export type ComponentPropsData = {
	children?: ComponentChildrenData;
	events?: Fn<unknown>[];	// Массив функций для ДЕФОЛТНОГО действия (клик для кнопки и т.д.)
	[key: string]: any;
};

// Класс базового компонента
export default abstract class Component<PropsType> {

	// Делаем действия публичными
	public static readonly EVENTS = EVENTS;

	// Список всех компонентов - используется для поиска родителя при уничтожении
	private static readonly _allComponents: Component<unknown>[] = [];

	private _document: HTMLElement; // Тут хранится DOM-дерево компонента
	public readonly eventBus: EventBus;
	public readonly props: ComponentPropsData; // Основные пропсы (чилдрены отделяются)
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
		this.props = this._makePropsProxy(props) ;

		// Вызываем инициализацию компонента
		this.eventBus.emit(Component.EVENTS.init);

		// Вырезаем чилдренов из пропсов и вставляем  чилдрены в элемент
		Object.assign(this.children, this._getChildrenFromProps(props));
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
		this.eventBus.on(Component.EVENTS.registerBasementAction,
			this._registerBasementActionForEventBus.bind(this));
		this.eventBus.on(Component.EVENTS.render, this._render.bind(this));
		this.eventBus.on(Component.EVENTS.update, this._update.bind(this));
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

	// Метод обновления пропсов элемента
	protected _update(prop: string): void {
		this.update(prop);
	}

	// Метод обновления пропсов элемента, должен быть описан в дочернем классе
	protected abstract update(prop: string): void

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

	// Метод возвращает ключевой HTML элемент из всего документа
	// Может быть перезаписан в дочернем классе
	// По-умолчанию возвращает весь документ
	public target(): HTMLElement {
		return this.document();
	}

	// Методы для прокси
	private readonly _proxyActions = {
		getProp: (target: ComponentPropsData, prop: string): unknown => {
			return target[prop];
		},
		setProp: (target: ComponentPropsData, prop: string, value: unknown): boolean => {
			target[prop] = value;
			return true;
		},
		deleteProp: (target: ComponentPropsData, prop: string): boolean => {
			delete target[prop];
			return true;
		}
	}

	// Прокси для основных пропсов элемента
	// Отличия: после изменения вызывается update компонента
	private _makePropsProxy(props: ComponentPropsData): ComponentPropsData {
		const proxySetting = {
			get: (target: ComponentPropsData, prop: string): unknown => {
				return this._proxyActions.getProp(target, prop)
			},
			set: (target: ComponentPropsData, prop: string, value: unknown): boolean => {
				if (target[prop] === value) {
					return true;
				}
				const result = this._proxyActions.setProp(target, prop, value);
				this.eventBus.emit(Component.EVENTS.update, prop);
				return result
			},
			deleteProperty: (target: ComponentPropsData, prop: string): boolean => {
				const result = this._proxyActions.deleteProp(target, prop);
				this.eventBus.emit(Component.EVENTS.update, prop);
				return result
			}
		};
		return new Proxy(props as ComponentPropsData, proxySetting) as ComponentPropsData;
	}

	// Прокси для children элемента
	// Отличия: значения превращаются в прокси
	private _makeChildrenObjectProxy(props: ComponentChildrenData): ComponentChildrenData {
		const proxySetting = {
			get: (target: ComponentChildrenData, prop: string): unknown => {
				// Если ключ отсутствует, то создаём для него прокси с пустым массивом
				if (this._proxyActions.getProp(target, prop) === undefined) {
					this.children[prop] = this._makeChildrenArrayProxy([]);
					this.children[prop] = [];
				}
				return this._proxyActions.getProp(target, prop)
			},
			set: (
				target: ComponentChildrenData,
				prop: string,
				value: Component<unknown>[]
			): boolean => {
				// Значение превращаем в прокси
				value = this._makeChildrenArrayProxy(value);
				return this._proxyActions.setProp(target, prop, value);
			},
			deleteProperty: (target: ComponentChildrenData, prop: string): boolean => {
				return this._proxyActions.deleteProp(target, prop);
			}
		};
		return new Proxy(props, proxySetting) as ComponentChildrenData;
	}

	// Прокси для массивов внутри children элемента
	// Отличия: после изменения ничего не вызывается и значения хранятся как есть
	private _makeChildrenArrayProxy(props: Component<unknown>[]): Component<unknown>[] {
		const proxySetting = {
			get: (target: ComponentPropsData, prop: string): unknown => {
				return this._proxyActions.getProp(target, prop)
			},
			set: (target: ComponentPropsData, prop: string, value: unknown): boolean => {
				return this._proxyActions.setProp(target, prop, value);
			},
			deleteProperty: (target: ComponentPropsData, prop: string): boolean => {
				return this._proxyActions.deleteProp(target, prop);
			}
		};
		return new Proxy(props, proxySetting) as Component<unknown>[];
	}

	// Регистрация базовых действий для интерактивных компонентов (click, change и т.д.)
	private _registerBasementActionForEventBus(
		htmlAction: string | false,
		eventBusAction: string
	): void {
		if (this.props.events && this.props.events.length > 0) {
			this.props.events.forEach(event => {
				this.eventBus.on(eventBusAction, event);
			});
		}
		delete this.props.events;
		if (htmlAction && htmlAction.length > 0) {
			this.target().addEventListener(htmlAction, (e) => {
				e.preventDefault();
				this.eventBus.emit(eventBusAction);
			})
		}
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
		parent: Component<unknown> | boolean,
		holder: string,
		index: number
	} {
			let parentComponent: Component<unknown> | boolean = false;
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
