import {EventBus} from "~src/components/event-bus";
import Randomizer from "~src/modules/randomizer";

enum EVENTS {
	// INIT: "init",
	// FLOW_CDM: "flow:component-did-mount",
	// FLOW_CDU: "flow:component-did-update",
	// FLOW_RENDER: "flow:render",
	windowClose = "window:close",
	buttonClick = "click",
	inputChange = "change"
};

export class Component {

	public static readonly EVENTS = EVENTS;

	protected readonly _element: HTMLElement;
	public readonly eventBus: EventBus;
	protected readonly id: string;
	private _targetElement: HTMLElement;

	constructor(document: HTMLElement, targetElementSelector: string = '') {
		this.id = Randomizer.next();
		this._element = document;
		this._element.id = this.id;
		this.eventBus = new EventBus();
		this._targetElement = (targetElementSelector.length > 0)
			? this.subElement(targetElementSelector)
			: this.document();
	}

	protected registerBasementActionsForEventBus = (actions: string[]): void => {
		actions.forEach(action => {
			this.target().addEventListener(action, (e) => {
				e.preventDefault();
				this.eventBus.emit(action);
			})
		});
	}

	document = (): HTMLElement => {
		return this._element;
	}

	target = (): HTMLElement => {
		return this._targetElement;
	}

	subElements = (selector: string): HTMLElement[] => {
		return Array.from(this._element.querySelectorAll(selector));
	}

	subElement = (selector: string): HTMLElement => {
		const elements = this.subElements(selector);
		if (elements.length === 0) {
			throw new Error(`Элемент ${selector} не найден`);
		}
		return elements[0];
	}
}
