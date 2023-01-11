import Handlebars from 'handlebars';
//import Handlebars from 'handlebars/dist/handlebars.runtime';
import tpl from './tpl.hbs';
import './style.css';
import {Component, generateDom} from "../components";

Handlebars.registerPartial('button', tpl);

export default class Button extends Component{
	constructor(id, value) {
		const document = generateDom(tpl({
			id,
			value
		})).firstChild;
		super(document, `button`);
	}
	test = () => {
		console.log('test');
	}
	
}