import tpl_full from './tpl_full.hbs';
import tpl_only_input from './tpl_only_input.hbs';
import Component, {ComponentPropsData, EVENTS} from "~src/components/components";
import {generateDom} from "~src/modules/functions";
import {Fn} from "~src/modules/functions";

// Регистрируем инпут как Partial (используется в шаблоне tpl_full)
import * as handlebars from "handlebars";
handlebars.registerPartial('input', tpl_only_input);

// Тип данных для инпута
type inputData = {
	type?: string,
	name?: string,
	value?: string,
	className?: string,
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
export default class Input extends Component {

	// Делаем действия публичными
	public static override readonly EVENTS = InputEVENTS;

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
			this.props['targetSelector']='input'; // Сохраняем указатель самого импута в пропсы
		}else{
			templateFunction=input;
		}
		return generateDom(templateFunction(data));
	}

	// Метод обновления DOM-дерева после обновления пропса
	protected override updateProp(): void {
		return;
	}

	// Метод получения пропса из DOM-дерева
	protected override getProp(prop: string): { fromDom: boolean; value: unknown } {
		const result = {
			fromDom: false,
			value: ''
		}
		// Ищем в значение в DOM-дереве только если документ уже построен
		if(this.document()!==undefined){
			switch (prop){
				case 'value':
					result.fromDom=true;
					result.value=this.target().value;
					break;
			}
		}
		return result;
	}

	// Возвращаем активный элемент инпута (на случай сложного DOM)
	public override target = ():HTMLInputElement => {
		if(this.props.targetSelector){
			return this.subElement(this.props['targetSelector'] as string) as HTMLInputElement;
		}else{
			return this.document() as HTMLInputElement;
		}
	}

	// Метод превращения DOM-элемента в экземпляр  Input
	// Внимание: пока не умеет находить label
	public static makeInput(renderedInput: HTMLElement, events: Fn<unknown>[] = []): Input {
		const type = renderedInput.getAttribute('type') || undefined;
		const className = renderedInput.getAttribute('class') || undefined;
		const name = renderedInput.getAttribute('name') || undefined;
		const input = new Input({
			type,
			className,
			name,
			events
		});
		renderedInput.replaceWith(input.document());
		return input;
	}
}
