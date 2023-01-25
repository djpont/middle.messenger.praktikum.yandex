import tpl from "./tpl.hbs";
import {Component} from "~src/components/components";
import {generateDom} from "~src/functions";

type buttonData = {
	name?: string,
	type?: string,
	text?: string
}

export const button = (data: buttonData): string => {
	const {
		name = '',
		type = '',
		text = ''
	} = data;
	return tpl({name, type, text});
};

export class Button extends Component {
	constructor(buttonData: buttonData) {
		const element: HTMLElement = generateDom(button(buttonData));
		super(element);
		this.registerBasementActionsForEventBus([
			Component.EVENTS.buttonClick
		]);
	}
}
