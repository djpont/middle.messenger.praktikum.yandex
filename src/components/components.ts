export const generateDom = (html_code): HTMLElement => {
	const dom =  document.createRange().createContextualFragment(html_code);
	return dom.firstChild as HTMLElement;
}

export class Component{
	#mainElementSelector;
	#document;
	constructor(document: HTMLElement, mainElementSelector: string) {
		this.#document=document;
		this.#mainElementSelector=mainElementSelector;
	}
	document = (): HTMLElement => {
		return this.#document;
	}
	element = (): HTMLElement => {
		return this.#document.querySelector(this.#mainElementSelector);
	}
	subElements = (selector: string): HTMLElement[] => {
		return Array.from(this.document().querySelectorAll(selector));
	}
	subElement = (selector: string): HTMLElement => {
		return this.subElements(selector)[0];
	}
}
