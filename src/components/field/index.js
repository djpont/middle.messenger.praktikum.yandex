import Handlebars from 'handlebars';
//import Handlebars from 'handlebars/dist/handlebars.runtime';
import tpl from './tpl.hbs';
import {Component, generateDom} from "../components";
import {joinDom} from "/src/functions";
import './style.css';

export default class Field extends Component{
	constructor(content = [], className='field') {
		const document = generateDom(tpl({
			className
		}));
		const contentDom = joinDom(...content);
		document.append(contentDom);
		super(document, 'div');
	}
}