import errorFromTemplate, {errorData} from "./error";
import './style.scss';
import {button} from "~src/components/button";

export default (rootElement: HTMLElement): void => {
	const closeButton: string = button({
		id: 'close',
		name: 'close',
		value: 'Закрыть'
	});
	const data: errorData = {
		id: 'error_404',
		title: 'Ошибка',
		description1: 'Страница, которую Вы запрашиваете, не найдена.',
		description2: 'Проверьте правильность написания адреса и попробуйте еще раз.' +
			'<br>Код ошибки: 404.',
		closeButton: closeButton
	}
	errorFromTemplate(rootElement, data);
}
