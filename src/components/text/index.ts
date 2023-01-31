import tpl from "./tpl.hbs";
import Component, {ComponentPropsData} from "~src/components/components";
import {generateDom} from "~src/functions";

type textData = {
	name?: string,
	className?: string,
	text?: string
} & ComponentPropsData;

const text = (data: textData): string => {
	const {
		name = '',
		className = '',
		text = ''
	} = data;
	return tpl({name, className, text});
};

export default class Text extends Component<textData>{

	constructor(props: textData) {
		super(props);
	}

	protected override render(data: textData):HTMLElement{
		return generateDom(text(data));
	}

	protected override update(prop: string): void {
		let element: HTMLElement | null = null;
		const value = this.props[prop];
		switch (prop) {
			case 'text':
				element = this.target();
				break;
		}
		if (element) {
			element.textContent = value;
		}
	}
}
