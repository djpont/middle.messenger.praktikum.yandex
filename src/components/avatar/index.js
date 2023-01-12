import Handlebars from 'handlebars';
//import Handlebars from 'handlebars/dist/handlebars.runtime';
import tpl from './tpl.hbs';
import './style.css';
import {Component, generateDom} from "../components";

Handlebars.registerPartial('avatar', tpl);

export const avatar = (imageSource, className) => {
	return tpl({ imageSource, className });
};

export default class Avatar extends Component{
	constructor(imageSource, className) {
		const document = generateDom(avatar(
			imageSource, className
		));
		super(document, `div.avatar`);
	}
}