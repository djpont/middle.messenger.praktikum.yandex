export const generateDom = (html_code: string): HTMLElement => {
	const dom = document.createRange().createContextualFragment(html_code);
	return dom.firstChild as HTMLElement;
}

export class Component {
	private _mainElementSelector: string;
	private _document: HTMLElement;

	constructor(document: HTMLElement, mainElementSelector: string) {
		this._document = document;
		this._mainElementSelector = mainElementSelector;
	}

	document = (): HTMLElement => {
		return this._document;
	}

	element = (): HTMLElement => {
		return this.subElement(this._mainElementSelector);
	}

	subElements = (selector: string): HTMLElement[] => {
		return Array.from(this.document().querySelectorAll(selector));
	}

	subElement = (selector: string): HTMLElement => {
		const elements = this.subElements(selector);
		if (elements.length === 0) {
			throw new Error(`Элемент ${selector} не найден`);
		}
		return elements[0];
	}
}
