import tpl from "./tpl.hbs";
import BaseComponent, {ComponentPropsData} from "../components";
import {generateDom} from "../../modules/functions";

// Компонент Text отвечает за элемент, содержащий текстовую строку

// Тип данных для текста
type textData = {
	name?: string,
	className?: string,
	text?: string
} & ComponentPropsData;

// Метод рендера HTML-строки текста по шаблону
const text = (data: textData): string => {
	const {
		name = '',
		className = '',
		text = ''
	} = data;
	return tpl({name, className, text});
};

// Класс текста
export default class Text extends BaseComponent<textData> {

	constructor(props: textData) {
		// Сначала создаём базовый компонент  и рендерим его
		super(props);
	}

	// Метод рендера DOM-дерева кнопки по шаблону
	protected override render(data: textData):HTMLElement{
		return generateDom(text(data));
	}

	// Метод обновления DOM-дерева после обновления пропса
	protected override _updateProp(prop: string): void {
		switch (prop) {
			case 'text':
				this.target().textContent = this.props[prop] as string;
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
}
