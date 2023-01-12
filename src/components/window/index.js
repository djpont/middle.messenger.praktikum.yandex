import Handlebars from 'handlebars';
//import Handlebars from 'handlebars/dist/handlebars.runtime';
import tpl from './tpl.hbs';
import './style.css';
import {Component, generateDom} from "../components";

// Handlebars.registerPartial('window', tpl);

export default class Window extends Component{
	constructor(id, content, title = '', subtitle = '') {
		const document=generateDom(tpl({
			id,
			content,
			title,
			subtitle
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
		const documentElement = this.subElement(':scope > div.content');
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
			insertHTML: (html_code) => documentElement.innerHTML+=html_code,
			clearHTML: () => documentElement.innerHTML='',
			append,
			element: () => documentElement,
		}
	};
}