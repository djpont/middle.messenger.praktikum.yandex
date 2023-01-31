import tpl from "./tpl.hbs";
import Component, {ComponentPropsData} from "~src/components/components";
import {generateDom} from "~src/functions";
import "./style.scss";

type viewData = {
	roomElement: HTMLElement
} & ComponentPropsData;

const view = (): string => {
	return tpl();
};

export default class View extends Component<viewData>{

	private static _rootElement:HTMLElement;

	constructor(props: viewData) {
		super(props);
		View._rootElement=this.props.roomElement;
		View._rootElement.append(this.document());
	}

	protected render():HTMLElement{
		return generateDom(view());
	}

	protected override update(): void {
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
}
