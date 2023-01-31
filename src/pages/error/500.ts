import View from "~src/components/view";
import Alert from "~src/components/window/alert";
export default (rootElement: View): boolean => {

	// Создаём экземпляр класса отображения окон с сообщениями или ошибками
	const alert = new Alert({rootElement});

	alert.fatal([
			'Произошка ошибка в работе сервера.',
			'Попробуйте повторить действие позже.',
			'<br>Код ошибки: 500.'
		]
	);

	return true;
}
