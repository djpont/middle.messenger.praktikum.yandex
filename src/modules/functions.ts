import Component from "~src/components/components";
import Input from "~src/components/input";

// В этом файле находятся мелкие полезные функции

// Тип данных для функции
export type Fn<T> = (...args: unknown[]) => T;

// Функция совмещения компонентов в единый DOM-элемент
export const joinDom = (components: Component[]) => {
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
export const fetchDataFromInputs = (...inputs: Input[]): {[key: string]: string} => {
	const data: {[key: string]: string} = {};
	inputs.forEach(input => {
		if(typeof input.props.name === 'string' && typeof input.props.value === 'string'){
			data[input.props.name]=input.props.value;
		}
	});
	return data;
}
