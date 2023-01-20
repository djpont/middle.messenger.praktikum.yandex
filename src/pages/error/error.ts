import tpl from './tpl.hbs';
import {generateDom} from "~src/components/components";

export type errorData = {
	id: string,
	title: string,
	description1: string,
	description2: string,
	closeButton?: string
}

export default (rootElement: HTMLElement, data: errorData) => {
	const document = generateDom(tpl(data));
	rootElement.append(document);
}
