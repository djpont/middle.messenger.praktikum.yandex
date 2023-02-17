import tpl from "./tpl.hbs";
import BaseComponent, {ComponentPropsData, EventsType} from "~src/components/components";
import {generateDom} from "~src/modules/functions";

// Компонент Form отвечает за формы

// Тип данных для формы
type formData = {
	name?: string,
	className?: string
} & ComponentPropsData;

// Метод рендера HTML-строки формы по шаблону
const form = (data: formData): string => {
	const {
		name = '',
		className = ''
	} = data;
	return tpl({name, className});
};

// Класс кнопки
export default class Form extends BaseComponent<formData> {

	constructor(props: formData) {
		super(props);
	}

	// Метод рендера DOM-дерева кнопки по шаблону
	protected override render(data: formData): HTMLElement {
		return generateDom(form(data));
	}

	// Метод обновления DOM-дерева после обновления пропса
	protected override _updateProp(prop: string): void {
		const value = this.props[prop] as string;
		switch (prop) {
			case 'name':
				this.target().setAttribute('name', value);
				break;
			case 'className':
				this.target().className = value;
				break;
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
	// Получаем данные формы
	public getFormData(): {[key: string]: string} {
		const data: {[key: string]: string} = {};
		this.subElements('input').forEach((input: HTMLInputElement) => {
			if(input.name){
				data[input.name]=input.value;
			}
		});
		return data;
	}

	// Метод очистки формы
	public clearFormData(): void {
		this.subElements('input').forEach((input: HTMLInputElement) => {
			input.value='';
		});
	}

	// Метод превращения DOM-элемента в экземпляр Button
	public static makeForm(renderedForm: HTMLElement, events: EventsType = {}): Form {
		const className = renderedForm.getAttribute('class') || undefined;
		const name = renderedForm.getAttribute('name') || undefined;
		const form = new Form({
			className,
			name
		});
		form.setDocument(renderedForm);
		form.props.events = events;
		return form;
	}


}
