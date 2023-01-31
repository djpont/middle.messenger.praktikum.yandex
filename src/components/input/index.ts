import tpl_full from './tpl_full.hbs';
import tpl_only_input from './tpl_only_input.hbs';
import Component, {ComponentPropsData, EVENTS} from "~src/components/components";
import {generateDom} from "~src/functions";

import {Fn} from "~src/functions";

// Регистрируем инпут как Partial (используется в шаблоне tpl_full)
import * as handlebars from "handlebars";
handlebars.registerPartial('input', tpl_only_input);

// Тип данных для инпута
type inputData = {
	type?: string,
	name?: string,
	value?: string,
	className?: string
} & ComponentPropsData;

// Тип данных для инпута с label
type inputDataWithLabel = {
	label?: string,
	isStacked?: boolean
} & inputData;


// Метод рендера HTML-строки инпута по шаблону
const input = (data: inputData): string => {
	const {
		type = 'text',
		name = '',
		value = '',
		className = ''
	} = data;
	return tpl_only_input({type, name, className, value});
};

// Метод рендера HTML-строки инпута с label кнопки по шаблону
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

// Класс инпута
export default class Input extends Component<inputDataWithLabel>{

	// Делаем действия публичными
	public static override readonly EVENTS = InputEVENTS;

	// селектор для импута (на случай сложного DOM, если кнопка имеет label)
	private _targetSelector:string|null = null;

	constructor(data: inputData | inputDataWithLabel) {
		// Сначала создаём базовый компонент  и рендерим его
		super(data);
		// Регистрируем базовое действие - изменения текста в инпуте
		this.eventBus.emit(Component.EVENTS.registerBasementAction, 'change', Input.EVENTS.change);
	}

	// Метод рендера DOM-дерева инпута по шаблону
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

	// Метод обновления DOM-дерева после обновления пропса
	protected override update(): void {
		return;
	}

	// Возвращаем активный элемент инпута (на случай сложного DOM)
	public override target = ():HTMLElement => {
		if(this._targetSelector===null){
			return this.document();
		}else{
			return this.subElement(this._targetSelector);
		}
	}
}
