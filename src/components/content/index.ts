import BaseComponent, {ComponentPropsData} from "../component/component";
import {Fn, generateDom} from "../../modules/functions/functions";

// Компонент Content отвечат за содержимое окна

// Тип данных для контанта
type contentType = {
	readonly template: Fn<string>,
	data?: unknown
} & ComponentPropsData;

// Класс контента
export default class Content extends BaseComponent {

	constructor(data: contentType) {
		// Сначала создаём базовый компонент  и рендерим его
		super(data);
	}

	// Метод рендера DOM-дерева кнопки по шаблону
	protected override render(data: contentType): HTMLElement {
		return generateDom((this.props as contentType).template(data));
	}

	// Метод обновления DOM-дерева после обновления пропса (пока таких нет)
	protected override _updateProp(): void {
		return;
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
