import tpl from './tpl.hbs';
import Window from "~src/components/window";
import {generateDom} from "~src/functions";
import './style.scss';

export default (rootElement: HTMLElement): void => {
	const page: Window = new Window({
			id: 'fileUpload',
			className: 'fileUpload',
			title: 'Загрузка файла',
			controls: {
				close: true
			}
		})
	;
	rootElement.append(page.document());

	const document: HTMLElement = generateDom(tpl({}));
	page.content().append(document);

}
