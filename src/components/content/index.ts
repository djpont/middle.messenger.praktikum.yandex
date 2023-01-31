import Component, {ComponentPropsData} from "~src/components/components";
import {generateDom} from "~src/functions";

type contentType = {
	readonly template: (...args: any) => string,
	data?: unknown
} & ComponentPropsData;

export default class Content extends Component<contentType> {

	constructor(data: contentType) {
		super(data);
	}

	protected override render(data: contentType): HTMLElement {
		return generateDom(this.props.template(data));
	}

	protected override update(): void {
		return;
	}

}
