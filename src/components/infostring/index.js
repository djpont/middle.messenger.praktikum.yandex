import Handlebars from 'handlebars';
//import Handlebars from 'handlebars/dist/handlebars.runtime';
import tpl from './tpl.hbs';
import './style.css';
import {Component, generateDom} from "../components";

Handlebars.registerPartial('infostring', tpl);

export const infostring = (label, text) => {
	return tpl({ label, text });
};

export default class Infostring extends Component{
	constructor(label, text) {
		const document = generateDom(infostring(
			label, text
		));
		super(document, `div.infostring`);
	}
}