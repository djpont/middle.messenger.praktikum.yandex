import tpl from "./tpl.hbs";
import Component, {ComponentPropsData, EVENTS} from "~src/components/components";
import {Fn, generateDom} from "~src/modules/functions";

// Компонент Button отвечает за кнопки

// Тип данных для кнопки
type buttonData = {
	name?: string,
	type?: string,
	text?: string,
	className?: string
} & ComponentPropsData;

// Метод рендера HTML-строки кнопки по шаблону
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

// Класс кнопки
export default class Button extends Component<buttonData>{

	// Делаем действия публичными
	public static override readonly EVENTS = ButtonEVENTS;

	constructor(props: buttonData) {
		// Сначала создаём базовый компонент  и рендерим его
		super(props);
		// Регистрируем базовое действие - клик по кнопке
		this.eventBus.emit(Component.EVENTS.registerBasementAction, 'click', Button.EVENTS.click);
	}

	// Метод рендера DOM-дерева кнопки по шаблону
	protected override render(data: buttonData):HTMLElement{
		return generateDom(button(data));
	}

	// Метод обновления DOM-дерева после обновления пропса
	protected override updateProp(prop: string): void {
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

	// Метод получения пропса из DOM-дерева
	protected override getProp(): { fromDom: boolean; value: unknown } {
		const result = {
			fromDom: false,
			value: ''
		}
		return result;
	}

	// Метод превращения DOM-элемента в экземпляр Button
	public static makeButton(renderedButton: HTMLElement, events: Fn<unknown>[] = []): Button {
		const type = renderedButton.getAttribute('type') || undefined;
		const className = renderedButton.getAttribute('class') || undefined;
		const name = renderedButton.getAttribute('name') || undefined;
		const text = renderedButton.textContent || undefined;
		const button = new Button({
			type,
			className,
			text,
			name,
			events
		});
		renderedButton.replaceWith(button.document());
		return button;
	}
}
