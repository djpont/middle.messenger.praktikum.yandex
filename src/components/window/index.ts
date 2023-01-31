import tpl from './tpl.hbs';
import Component, {ComponentPropsData, EVENTS} from "~src/components/components";
import {generateDom} from "~src/functions";

type windowData = {
	className?: string,
	title?: string,
	controls?: Record<string, boolean>
} & ComponentPropsData;

const window = (data: windowData): string => {
	const {
		className = '',
		title = '',
		controls = {}
	} = data;
	return tpl({className, title, controls});
};

// Дополнительные действия с компонентом
class WindowEVENTS extends EVENTS {
	static close = "window:close"; // Закрытие окна
}

export default class Window extends Component<windowData> {

	public static override readonly EVENTS = WindowEVENTS;

	constructor(data: windowData) {
		super(data);
		// Регистрация кнопок в шапке окна
		this._registerWindowControls();
		// Регистраия базового действия окна - закрытие
		this.eventBus.emit(Window.EVENTS.registerBasementAction, false, Window.EVENTS.close);
		// Добавляем к окну действие _close при закрытии окна
		this.eventBus.on(Window.EVENTS.close, this._close);
	}

	protected override render(data: windowData): HTMLElement {
		return generateDom(window(data));
	}

	protected override update(prop: string): void {
		let element: HTMLElement | null = null;
		const value = this.props[prop];
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

	// target = (): HTMLElement => {
	// 	return this.subElement('.window-body');
	// }

	public readonly close = ():void => {
		this.eventBus.emit(Window.EVENTS.close);
	}

	private readonly _close = ():void => {
		this.destroy();
	}

}
