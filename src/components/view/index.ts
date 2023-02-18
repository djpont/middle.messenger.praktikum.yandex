import tpl from "./tpl.hbs";
import BaseComponent, {ComponentPropsData} from "~src/components/components";
import {generateDom} from "~src/modules/functions";
import "./style.scss";

// Компонент View отвечает за корневой элемент, в котором отображаются окна
// Состоит из трех слоёв: main для рабочих окон, second для прочих окон
// и alert для окон сообщений и ошибок

// Тип данных для вью
type viewData = {
	rootElement: HTMLElement
} & ComponentPropsData;

// Метод рендера HTML-строки вью по шаблону
const view = (): string => {
	return tpl();
};

const LAYERS = {
	main: "main",
	second: "second",
	alert: "alert",
} as const;

// Класс вью
export default class View extends BaseComponent<viewData> {

	public static readonly LAYERS = LAYERS;

	private static _instance: View; // Синглтон

	constructor(props: viewData) {
		// Синглтон
		if(View._instance){
			return View._instance;
		}
		// Сначала создаём базовый компонент  и рендерим его
		super(props);
		// Добавляем документ вью в переданный родительский HTML-элемент
		this.props.rootElement.append(this.document());
		// Синглтон
		View._instance = this;
	}

	// Метод рендера DOM-дерева кнопки по шаблону
	protected render():HTMLElement{
		return generateDom(view());
	}

	// Метод обновления DOM-дерева после обновления пропса (пока таких нет)
	protected override _updateProp(): void {
		return;
	}

	// Метод очистки view (уничтожаем всех чилдренов)
	public clear = () => {
		Object.entries(this.children).forEach(([, children]) => {
			children.forEach(child => {
				child.destroy();
			});
			children.length=0;
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
