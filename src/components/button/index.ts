import tpl from "./tpl.hbs";
import Component, {ComponentPropsData, EVENTS} from "~src/components/components";
import {generateDom} from "~src/functions";

type buttonData = {
	name?: string,
	type?: string,
	text?: string,
	className?: string
} & ComponentPropsData;

const button = (data: buttonData): string => {
	const {
		name = '',
		type = 'button',
		text = '',
		className = ''
	} = data;
	return tpl({name, type, text, className});
};

// Дополнительные действия с компонентом
class ButtonEVENTS extends EVENTS {
	static click = "button:click"; // Клик на кнопку
}

export default class Button extends Component<buttonData>{

	public static override readonly EVENTS = ButtonEVENTS;

	constructor(props: buttonData) {
		super(props);
		// Регистрируем базовое действие - клик по кнопке
		this.eventBus.emit(Button.EVENTS.registerBasementAction, 'click', Button.EVENTS.click);
	}

	protected override render(data: buttonData):HTMLElement{
		return generateDom(button(data));
	}

	protected override update(prop: string): void {
		let element: HTMLElement | null = null;
		const value = this.props[prop];
		switch (prop) {
			case 'id':
				this.target().id=value;
				break;
			case 'text':
				element = this.target();
				break;
		}
		if (element) {
			element.textContent = value;
		}
	}

}
