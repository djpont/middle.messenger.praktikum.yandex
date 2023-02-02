import tpl from './tpl.hbs';
import "./style.scss";
import View from "~src/components/view";
import Window from "~src/components/window";
import Content from "~src/components/content";
import Alert from "~src/components/window/alert";
import Input from "~src/components/input";
import Button from "~src/components/button";
import Routing from "~src/modules/routing";
import Validater from "~src/modules/validater";

// Страничка входа. Возвращает окно.

export default (rootElement: View): Window => {

	// Создаём экземпляр класса отображения окон с сообщениями или ошибками
	// const alert =
		new Alert({rootElement});

	// Создаём содержимое окна по шаблону
	const content = new Content({template: tpl});

	// Создаём окно с созданным выше содержимым
	const window = new Window({
		className: 'signIn',
		title: 'WinChat 98 - Электронные диалоги',
		controls: {
			close: false
		},
		children: {
			content: [content]  // Передаем содержимое в чилдрены
		}
	});
	rootElement.children.main.push(window); // Добавляем окно в корневой элемент
	rootElement.updateChildren();	// Вызываем обновление чилдов корневого элемента

	// Метод для валидации инпутов
	function validate(input: Input) {
		Validater.validateInputWithAlert(input);
	}

	// Создаём экземпляры инпутов
	const inputLogin = new Input({
		name: 'login',
		type: 'text',
		label: 'Логин:',
		isStacked: false,
		events: [
			validate
		]
	});
	const inputPassword = new Input({
		name: 'password',
		type: 'password',
		label: 'Пароль:',
		isStacked: false,
		events: [
			validate
		]
	});
	// Вставляем инпуты в контент
	content.children.inputs = [inputLogin, inputPassword];

	// Создаём экземпляры кнопок
	const buttonSubmit = new Button({
		name: 'submit',
		type: 'submit',
		text: 'Вход',
		events: [
			() => {
				{
					const formValid = Validater.validateInputWithAlert(
						inputLogin,
						inputPassword
					);
					if(formValid){
						console.log('Метод авторизации пользователя');
					}
				}
			}
		]
	});
	const buttonRegister = new Button({
		name: 'registration',
		type: 'button',
		text: 'Регистрация',
		events: [
			() => {
				// Действие при нажатии на кнопку
				Routing('/sign-up', rootElement);
			}
		]
	});
	// Вставляем кноки в контент
	content.children.buttons = [buttonSubmit, buttonRegister];

	// Вызываем обновление чилдренов окна
	// В аргументах true - для рекурсии, чтобы вложенные дочерние элементы тоже обновились
	window.updateChildren(true);


	return window;
}
