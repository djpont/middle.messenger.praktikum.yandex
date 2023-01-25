import {Component} from "~src/components/components";

export type Fn<T> = (...args: unknown[]) => T;

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
