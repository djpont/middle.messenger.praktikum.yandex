import tpl from "./tpl.hbs";
import Component, {ComponentPropsData, EventsType} from "~src/components/components";
import {generateDom} from "~src/modules/functions";

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

// Класс кнопки
export default class Button extends Component<buttonData> {

	constructor(props: buttonData) {
		// Сначала создаём базовый компонент  и рендерим его
		super(props);
	}

	// Метод рендера DOM-дерева кнопки по шаблону
	protected override render(data: buttonData): HTMLElement {
		return generateDom(button(data));
	}

	// Метод обновления DOM-дерева после обновления пропса
	protected override updateProp(prop: string): void {
		let element: HTMLElement | null = null;
		const value = this.props[prop] as string;
		switch (prop) {
			case 'id':
				this.target().id = value;
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
	public static makeButton(renderedButton: HTMLElement, events: EventsType = {}): Button {
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
