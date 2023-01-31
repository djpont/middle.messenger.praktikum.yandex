import tpl_full from './tpl_full.hbs';
import tpl_only_input from './tpl_only_input.hbs';
import Component, {ComponentPropsData, EVENTS} from "~src/components/components";
import {generateDom} from "~src/functions";

import {Fn} from "~src/functions";
import * as handlebars from "handlebars";

handlebars.registerPartial('input', tpl_only_input);

type inputData = {
	type?: string,
	name?: string,
	value?: string,
	className?: string
} & ComponentPropsData;

type inputDataWithLabel = {
	label?: string,
	isStacked?: boolean
} & inputData;

const input = (data: inputData): string => {
	const {
		type = 'text',
		name = '',
		value = '',
		className = ''
	} = data;
	return tpl_only_input({type, name, className, value});
};

const inputWithLabel = (data: inputDataWithLabel): string => {
	const {
		type = 'text',
		name = '',
		value = '',
		label = '',
		isStacked = false
	} = data;
	return tpl_full({type, name, value, label, isStacked});
};

// Дополнительные действия с компонентом
class InputEVENTS extends EVENTS {
	static change = "input:change" // Изменение инпута
}

export default class Input extends Component<inputDataWithLabel>{

	public static override readonly EVENTS = InputEVENTS;
	private _targetSelector:string|null = null; // селектор для импута (на случай сложного DOM)

	constructor(data: inputData | inputDataWithLabel) {
		super(data);
		// Регистрируем базовое действие - изменения текста в инпуте
		this.eventBus.emit(Input.EVENTS.registerBasementAction, 'change', Input.EVENTS.change);
	}

	protected override render(data: inputDataWithLabel):HTMLElement{
		let templateFunction:Fn<string>;
		if('label' in data){
			templateFunction=inputWithLabel;
			this._targetSelector='input';
		}else{
			templateFunction=input;
		}
		return generateDom(templateFunction(data));
	}

	protected override update(): void {
		return;
	}

	public override target = ():HTMLElement => {
		if(this._targetSelector===null){
			return this.document();
		}else{
			return this.subElement(this._targetSelector);
		}
	}
}
