import tpl from './tpl.hbs';
import {Component, generateDom} from "../components";

export default class Window extends Component{
	constructor(id, windowClassName, title = '', controls=false) {
		const document=generateDom(tpl({
			id,
			windowClassName,
			title,
			controls
		}));
		super(document, 'div.window');
	}
	content = () =>{
		const appendToParent = (element, parent) => {
			if(element instanceof HTMLElement){
				parent.append(element);
				return;
			}else if(element instanceof Component){
				parent.append(element.document());
				return;
			}else if(typeof element === 'string'){
				parent.innerHTML+=element;
				return;
			}
			console.error('getDocument не понял что делать с элементом', element);
		}
		const documentElement = this.subElement(':scope > div.window-body');
		const append = (...el) => {
			if(Array.isArray(el)){
				for(const oneEl of el){
					appendToParent(oneEl, documentElement);
				}
			}else{
				appendToParent(el, documentElement);
			}
		}
		return {
			// insertHTML: (html_code) => documentElement.innerHTML+=html_code,
			clearHTML: () => documentElement.innerHTML='',
			append,
			element: () => documentElement,
		}
	};
}