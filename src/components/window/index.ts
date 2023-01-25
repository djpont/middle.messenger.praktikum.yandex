import tpl from './tpl.hbs';
import {Component} from "~src/components/components";
import {generateDom} from "~src/functions";

type windowData = {
	className?: string,
	title?: string,
	controls?: Record<string, boolean>
}

export default class Window extends Component {
	constructor(data: windowData) {
		const {
			className = '',
			title = '',
			controls = {}
		} = data;
		const document: HTMLElement = generateDom(tpl({
			className,
			title,
			controls
		}));
		super(document/*, 'div.window'*/);
		this._registerWindowControls();
	}

	private _registerWindowControls = ():void => {
		[['Close', Component.EVENTS.windowClose]].forEach(([label, action]) => {
			const button = this.document().querySelector(
				`:scope > .title-bar .title-bar-controls [aria-label="${label}"]`
			);
			if(button){
				const callback = ():void => {
					this.eventBus.emit(action);
				};
				button.addEventListener('click', callback);
			}
		});
		this.eventBus.on(Component.EVENTS.windowClose, this._windowClose, true);
	}

	windowBody = ():HTMLElement => {
		return this.subElement('.window-body');
	}

	private _windowClose = ():void => {
		console.log('windowClose');
	}

	/*content = () => {
		const appendToParent = (
			element: HTMLElement | Component | string,
			parent: HTMLElement
		): void => {
			if (element instanceof HTMLElement) {
				parent.append(element);
				return;
			} else if (element instanceof Component) {
				parent.append(element.document());
				return;
			} else if (typeof element === 'string') {
				parent.innerHTML += element;
				return;
			}
			// console.error('getDocument не понял что делать с элементом', element);
		}

		const documentElement: HTMLElement = this.subElement(':scope > div.window-body');

		const append = (el: HTMLElement | HTMLElement[]): void => {
			if (Array.isArray(el)) {
				for (const oneEl of el) {
					appendToParent(oneEl, documentElement);
				}
			} else {
				appendToParent(el, documentElement);
			}
		}

		return {
			// insertHTML: (html_code) => documentElement.innerHTML+=html_code,
			clearHTML: () => documentElement.innerHTML = '',
			append,
			element: () => documentElement,
		}
	};*/
}
