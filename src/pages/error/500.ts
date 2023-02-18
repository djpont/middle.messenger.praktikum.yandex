import Alert from "~src/components/window/alert";
import Window from "~src/components/window";

// Страничка ошибки 500. Возвращает окно.

export default (): Window => {
	return Alert.fatal([
			'Произошка ошибка в работе сервера.',
			'Попробуйте повторить действие позже.',
			'<br>Код ошибки: 500.'
		], false
	);
}
