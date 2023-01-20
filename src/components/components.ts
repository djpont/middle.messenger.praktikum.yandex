export const generateDom = (html_code: string): HTMLElement => {
	const dom =  document.createRange().createContextualFragment(html_code);
	return dom.firstChild as HTMLElement;
}

export class Component{
	private _mainElementSelector: string;
	private _document: HTMLElement;

	constructor(document: HTMLElement, mainElementSelector: string) {
		this._document=document;
		this._mainElementSelector=mainElementSelector;
	}

	document = (): HTMLElement => {
		return this._document;
	}

	element = (): HTMLElement => {
		return this._document.querySelector(this._mainElementSelector);
	}

	subElements = (selector: string): HTMLElement[] => {
		return Array.from(this.document().querySelectorAll(selector));
	}

	subElement = (selector: string): HTMLElement => {
		return this.subElements(selector)[0];
	}
}
