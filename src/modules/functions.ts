import BaseComponent from "~src/components/components";
import Input from "~src/components/input";
import Validator from "~src/modules/validator";

// В этом файле находятся мелкие полезные функции

// Тип данных для функции
export type Fn<T, A = unknown> = (...args: A[]) => T;

// Функция совмещения компонентов в единый DOM-элемент
export const joinDom = (components: BaseComponent[]) => {
	const dom = document.createDocumentFragment();
	for (const el of components) {
		dom.append(el.document());
	}
	return dom;
}

// Функция объединения html кода в одну строку
export const joinHTML = (elements: string[], addParentDiv = false) => {
	let html = elements.join('');
	if (addParentDiv) {
		html = `<div>${html}</div>`;
	}
	return html;

}

// Функция генерации DOM из строки
export const generateDom = (html_code: string): HTMLElement => {
	const dom = document.createRange().createContextualFragment(html_code);
	return dom.firstChild as HTMLElement;
}

// Функция превращения массива инпутов в data для Fetch запроса
export const fetchDataFromInputs = (...inputs: Input[]): { [key: string]: string } => {
	const data: { [key: string]: string } = {};
	inputs.forEach(input => {
		if (typeof input.props.name === 'string' && typeof input.props.value === 'string') {
			data[input.props.name] = input.props.value;
		}
	});
	return data;
}

// Метод для валидации инпутов
export function validate(input: Input) {
	if (input.props.value?.length) {
		Validator.validateInputWithAlert(input);
	}
}


export function isEqual(a: object, b: object): boolean {
	if (Object.keys(a).length === Object.keys(b).length) {
		for (let key in a) {
			key = key as keyof object;
			if (typeof a[key] === typeof b[key]) {
				if (typeof a[key] === 'object' && a[key] !== null) {
					if (!isEqual(a[key], b[key])) {
						return false;
					}
				} else {
					if (!(a[key as any] === b[key as any])) {
						return false;
					}
				}
			} else {
				return false;
			}
		}
	} else {
		return false;
	}
	return true;
}


export function activateTabs(document: HTMLElement): Record<string, Fn<unknown>> {
	const tabs = document.querySelectorAll('[role="tabpanel"]') as NodeList;
	const tabList = document.querySelector('[role="tablist"]') as HTMLElement;
	const btns = tabList.querySelectorAll('button') as NodeList;
	const events={}
	btns.forEach(btn => {
		const ariaControls = (btn as HTMLElement).getAttribute('aria-controls') as string;
		events[ariaControls]=() => {
			clearAll();
			(btn as HTMLElement).setAttribute('aria-selected', 'true');
			tabs.forEach(tab => {
				if((tab as HTMLElement).getAttribute('aria')===ariaControls){
					(tab as HTMLElement).removeAttribute('hidden');
				}
			})
		}
		btn.addEventListener('click', events[ariaControls]);
	});
	function clearAll(): void{
		tabs.forEach(tab => {
			(tab as HTMLElement).setAttribute('hidden', 'true');
		})
		btns.forEach(btn => {
			(btn as HTMLElement).setAttribute('aria-selected', 'false');
		})
	}
	return events;
}


