import errorFromTemplate from "./error";
import './style.css';

export default (rootElement) => {
	const data={
		id:'error_500',
		title:'Ошибка',
		description1:'Произошка ошибка в работе сервера.',
		description2:'Попробуйте повторить действие позже.<br>Код ошибки: 500'
	}
	errorFromTemplate(rootElement, data);
	
}