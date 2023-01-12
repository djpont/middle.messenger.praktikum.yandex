import Handlebars from 'handlebars';
//import Handlebars from 'handlebars/dist/handlebars.runtime';
import tpl from './tpl.hbs';
import './style.css';
import {Component, generateDom} from "../components";

Handlebars.registerPartial('input', tpl);


export default class Input extends Component{
	constructor(id, type = 'text', label = '', value = '') {
		const document = generateDom(tpl({
			id,
			type,
			value,
			label
		}));
		super(document, 'input')
	}
}