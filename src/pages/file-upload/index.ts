import tpl from './tpl.hbs';
import Window from "~src/components/window";
import {generateDom} from "~src/components/components";
import './style.scss';

export default (rootElement, user) => {
	const page = new Window(
		'file-upload',
		'file-upload',
		'Загрузка файла',
		{
			close:true
		}
	);
	rootElement.append(page.document());
	
	const document=generateDom(tpl({}));
	page.content().append(document);
	
}
