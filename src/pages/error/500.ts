import errorFromTemplate, {errorData} from "./error";
import './style.scss';

export default (rootElement: HTMLElement): void => {
	const data: errorData = {
		id: 'error_500',
		title: 'Ошибка',
		description1: 'Произошка ошибка в работе сервера.',
		description2: 'Попробуйте повторить действие позже.<br>Код ошибки: 500'
	}
	errorFromTemplate(rootElement, data);
}
