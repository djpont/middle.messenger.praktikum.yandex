import {Component} from "~src/components/components";

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
