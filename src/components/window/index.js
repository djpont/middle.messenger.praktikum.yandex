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
		})).firstChild;
		super(document, 'div.window');
	}
	content = () =>{
		const getDocument = (element) => {
			if(element instanceof HTMLElement){
				return element;
			}else if(element instanceof Component){
				return element.document();
			}
			console.error('getDocument не понял что делать с элементом', element);
		}
		const documentElement = this.subElement(':scope > div.content');
		const append = (...el) => {
			if(Array.isArray(el)){
				for(const oneEl of el){
					documentElement.append(getDocument(oneEl));
				}
			}else{
				documentElement.append(getDocument(el));
			}
		}
		return {
			insertHTML: (html_code) => documentElement.innerHTML+=html_code,
			append,
			element: () => documentElement
		}
	};
}