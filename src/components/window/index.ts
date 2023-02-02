import tpl from './tpl.hbs';
import Component, {ComponentPropsData, EVENTS} from "~src/components/components";
import {generateDom} from "~src/modules/functions";

// Компонент Window отвечает за окно - шапка с заголовком и кнопкой закрытия,
// а так же рамка и пространство для содержимого (для экземпляра класса Content)

// Тип данных для окна
type windowData = {
	className?: string,
	title?: string,
	controls?: Record<string, boolean>
} & ComponentPropsData;


// Метод рендера HTML-строки окна по шаблону
const window = (data: windowData): string => {
	const {
		className = '',
		title = '',
		controls = {}
	} = data;
	return tpl({className, title, controls});
};

// Дополнительные действия с окном
class WindowEVENTS extends EVENTS {
	static close = "window:close"; // Закрытие окна
}

// Класс окна
export default class Window extends Component {

	// Делаем действия публичными
	public static override readonly EVENTS = WindowEVENTS;

	constructor(data: windowData) {
		// Сначала создаём базовый компонент  и рендерим его
		super(data);
		// Регистрация кнопок из шапки окна
		this._registerWindowControls();
		// Регистрируем базовое действие - закрытие окна
		this.eventBus.emit(Component.EVENTS.registerBasementAction, false, Window.EVENTS.close);
		// Добавляем к окну действие _close при закрытии окна
		this.eventBus.on(Window.EVENTS.close, this._close);
	}

	// Метод рендера DOM-дерева кнопки по шаблону
	protected override render(data: windowData): HTMLElement {
		return generateDom(window(data));
	}

	// Метод обновления DOM-дерева после обновления пропса
	protected override updateProp(prop: string): void {
		let element: HTMLElement | null = null;
		const value = this.props[prop] as string;
		switch (prop) {
			case 'id':
				element = this.document();
				break;
			case 'title':
				element = this.subElement('.title-bar .title-bar-text');
				break;
			case 'className':
				this.target().className = value;
				break;
		}
		if (element) {
			element.textContent = value;
		}
	}

	// Метод получения пропса из DOM-дерева
	protected override getProp(): { fromDom: boolean; value: unknown } {
		const result = {
			fromDom: false,
			value: ''
		}
		return result;
	}

	// Метод регистрации действий на нажатия кнопок в шапке окна (Закрыть окно и т.д.)
	private _registerWindowControls = ():void => {
		[[
			'Close', Window.EVENTS.close
		]].forEach(([label, action]) => {
			const button = this.document().querySelector(
				`:scope > .title-bar .title-bar-controls [aria-label="${label}"]`
			);
			if(button){
				button.addEventListener('click', () => {
					this.eventBus.emit(action);
				});
			}
		});
	}

	// Метод закрытия окна - эмитирует цепочки эвент баса
	public readonly close = ():void => {
		this.eventBus.emit(Window.EVENTS.close);
	}

	// Метод закрытия окна - непосредственно уничтожение экземпляра окна
	private readonly _close = ():void => {
		this.destroy();
	}

}
