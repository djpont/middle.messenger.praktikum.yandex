import tpl from './tpl.hbs';
import {generateDom} from "/src/components/components";
export default (rootElement, data) => {
	const document = generateDom(tpl(data));
	rootElement.append(document);
}