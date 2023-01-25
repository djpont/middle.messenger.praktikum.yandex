import tpl_full from './tpl_full.hbs';
import tpl_only_input from './tpl_only_input.hbs';
import {Component} from "~src/components/components";
import {generateDom} from "~src/functions";

import {Fn} from "~src/functions";
import * as handlebars from "handlebars";

handlebars.registerPartial('input', tpl_only_input);

type inputData = {
	id?: string,
	type?: string,
	name?: string,
	value?: string,
}

type inputDataWithLabel = {
	label?: string,
	isStacked?: boolean
} & inputData;

export const input = (data: inputData): string => {
	const {
		type = 'text',
		name = '',
		value = ''
	} = data;
	return tpl_only_input({type, name, value});
};

export const inputWithLabel = (data: inputDataWithLabel): string => {
	const {
		type = 'text',
		name = '',
		value = '',
		label = '',
		isStacked = false
	} = data;
	return tpl_full({type, name, value, label, isStacked});
};

export class Input extends Component {
	constructor(data1: inputData | inputDataWithLabel) {
		let templateFunction:Fn<string>;
		let targetSelector:string;
		if('label' in data1){
			templateFunction=inputWithLabel;
			targetSelector='input';
		}else{
			templateFunction=input;
			targetSelector='';
		}
		const element: HTMLElement = generateDom(templateFunction(data1));
		super(element, targetSelector);
		this.registerBasementActionsForEventBus([
			Component.EVENTS.inputChange
		]);
	}
}
