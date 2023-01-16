import errorFromTemplate from "./error";
import './style.css';
import {button} from "/src/components/button";

export default (rootElement) => {
	const closeButton = button('close','Закрыть');
	const data={
		id:'error_404',
		title:'Ошибка',
		description1:'Страница, которую Вы запрашиваете, не найдена.',
		description2:'Проверьте правильность написания адреса и попробуйте еще раз.<br>Код ошибки: 404.',
		closeButton:closeButton
	}
	errorFromTemplate(rootElement, data);
}