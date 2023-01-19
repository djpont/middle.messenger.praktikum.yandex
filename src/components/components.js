export const generateDom = (html_code) => {
	const dom =  document.createRange().createContextualFragment(html_code);
	return dom.firstChild;
}

export class Component{
	#mainElementSelector;
	#document;
	constructor(document, mainElementSelector) {
		this.#document=document;
		this.#mainElementSelector=mainElementSelector;
	}
	document = () => {
		return this.#document;
	}
	element = () => {
		return this.#document.querySelector(this.#mainElementSelector);
	}
	subElements = (selector) => {
		return Array.from(this.document().querySelectorAll(selector));
	}
	subElement = (selector) => {
		return this.subElements(selector)[0];
	}
}
