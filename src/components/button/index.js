import Handlebars from 'handlebars';
//import Handlebars from 'handlebars/dist/handlebars.runtime';
import tpl from './tpl.hbs';
import './style.css';
import {Component, generateDom} from "../components";

Handlebars.registerPartial('button', tpl);

export const button = (id, value) => {
	return tpl({ id, value });
};

export default class Button extends Component{
	
	#currentAction
	
	constructor(id, value) {
		const document = generateDom(button(
			id,
			value
		));
		super(document, `button`);
	}
	
	action = (callback) => {
		if(this.#currentAction){
			this.document().removeEventListener('click', this.#currentAction);
		}
		this.document().addEventListener('click', callback);
		this.#currentAction=callback;
	}
}