import tpl from "./tpl.hbs";
import Component, {ComponentPropsData} from "~src/components/components";
import {generateDom} from "~src/functions";
import "./style.scss";

// Компонент View отвечает за корневой элемент, в котором отображаются окна
// Состоит из двух слоёв: main для рабочих окон и alert для окон сообщений и ошибок

// Тип данных для вью
type viewData = {
	roomElement: HTMLElement
} & ComponentPropsData;

// Метод рендера HTML-строки вью по шаблону
const view = (): string => {
	return tpl();
};

// Класс вью
export default class View extends Component<viewData>{


	constructor(props: viewData) {
		// Сначала создаём базовый компонент  и рендерим его
		super(props);
		// Добавляем документ вью в переданный родительский HTML-элемент
		this.props.roomElement.append(this.document());
	}

	// Метод рендера DOM-дерева кнопки по шаблону
	protected render():HTMLElement{
		return generateDom(view());
	}

	// Метод обновления DOM-дерева после обновления пропса (пока таких нет)
	protected override updateProp(): void {
		return;
	}

	// Метод очистки view (уничтожаем всех чилдренов)
	public clear = () => {
		Object.entries(this.children).forEach(([, children]) => {
			children.forEach(child => {
				child.destroy();
			});
		});
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
