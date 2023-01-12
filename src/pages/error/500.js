import errorFromTemplate from "./error";
import './style.css';
import {Component} from "../../components/components";
import {button} from "../../components/button";

export default (rootElement) => {
	const button_close = button('close','Закрыть');
	const data={
		id:'error_500',
		title:'Ошибка',
		subtitle:'Произошка ошибка в работе сервера.',
		description:'Попробуйте повторить действие позже.<br>Код ошибки: 500',
		button:button_close
	}
	errorFromTemplate(rootElement, data);
	
}