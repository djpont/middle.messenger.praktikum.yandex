import Component, {ComponentPropsData} from "~src/components/components";
import {generateDom} from "~src/functions";

// Компонент Content отвечат за содержимое окна

// Тип данных для контанта
type contentType = {
	readonly template: (...args: any) => string,
	data?: unknown
} & ComponentPropsData;

// Класс контента
export default class Content extends Component<contentType> {

	constructor(data: contentType) {
		// Сначала создаём базовый компонент  и рендерим его
		super(data);
	}

	// Метод рендера DOM-дерева кнопки по шаблону
	protected override render(data: contentType): HTMLElement {
		return generateDom(this.props.template(data));
	}

	// Метод обновления DOM-дерева после обновления пропса (пока таких нет)
	protected override update(): void {
		return;
	}
}
