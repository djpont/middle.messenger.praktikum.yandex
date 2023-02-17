import Alert from "~src/components/window/alert";
import Window from "~src/components/window";

// Страничка ошибки 404. Возвращает окно.

export default (): Window => {
	return Alert.fatal([
			'Страница, которую Вы запрашиваете, не найдена.',
			'Проверьте правильность написания адреса и попробуйте еще раз.',
			'<br>Код ошибки: 404.'
		], false
	);
}
