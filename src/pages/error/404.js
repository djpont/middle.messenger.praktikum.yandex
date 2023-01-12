import errorFromTemplate from "./error";
import './style.css';
import {Component} from "/src/components/components";
import {button} from "/src/components/button";

export default (rootElement) => {
	const button_close = button('close','Закрыть');
	const data={
		id:'error_404',
		title:'Ошибка',
		subtitle:'Страница, которую Вы запрашиваете, не найдена.',
		description:'Проверьте правильность написания адреса и попробуйте еще раз.<br>Код ошибки: 404.',
		button:button_close
	}
	errorFromTemplate(rootElement, data);
}