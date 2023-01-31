import View from "~src/components/view";
import Alert from "~src/components/window/alert";
export default (rootElement: View): boolean => {

	// Создаём экземпляр класса отображения окон с сообщениями или ошибками
	const alert = new Alert({rootElement});

	alert.fatal([
			'Страница, которую Вы запрашиваете, не найдена.',
			'Проверьте правильность написания адреса и попробуйте еще раз.',
			'<br>Код ошибки: 404.'
		]
	);

	return true;
}
