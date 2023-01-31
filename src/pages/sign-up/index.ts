import tpl from './tpl.hbs';
import './style.scss';
import View from "~src/components/view";
import Window from "~src/components/window";
import Content from "~src/components/content";
// import Alert from "~src/components/window/alert";
import Input from "~src/components/input";
import Button from "~src/components/button";
import Routing from "~src/routing";

// Страничка регистрации. Возвращает окно.

export default (rootElement: View): Window => {

	// Создаём экземпляр класса отображения окон с сообщениями или ошибками
	// const alert = new Alert({rootElement});

	// Создаём содержимое окна по шаблону
	const content = new Content({ template:tpl });

	// Создаём окно с созданным выше содержимым
	const window = new Window({
		className: 'signUp',
		title: 'WinChat 98 - Регистрация',
		controls: {
			close: true
		},
		children: {
			content:[content]  // Передаем содержимое в чилдрены
		},
		events: [
			// Добавляем действие на закрытие окна
			() => Routing('/sign-in', rootElement)
		]
	});
	rootElement.children.main.push(window); // Добавляем окно в корневой элемент
	rootElement.updateChildren();

	// Создаём экземпляры инпутов
	const inputFirstName = new Input({
		name: 'first_name',
		type: 'text',
		label: 'Имя:',
		isStacked: true
	});
	const inputSecondName = new Input({
		name: 'second_name',
		type: 'text',
		label: 'Фамилия:',
		isStacked: true
	});
	const inputEmail = new Input({
		name: 'email',
		type: 'text',
		label: 'Адрес электронной почты:',
		isStacked: true
	});
	const inputPhone = new Input({
		name: 'phone',
		type: 'text',
		label: 'Телефон:',
		isStacked: true
	});
	const inputLogin = new Input({
		name: 'login',
		type: 'text',
		label: 'Логин:',
		isStacked: true
	});
	const inputPassword1 = new Input({
		name: 'password',
		type: 'password',
		label: 'Пароль:',
		isStacked: true
	});
	const inputPassword2 = new Input({
		name: 'password2',
		type: 'password',
		label: 'Пароль ещё раз:',
		isStacked: true
	});
	// Вставляем инпуты в контент
	content.children.inputs=[
		inputFirstName,
		inputSecondName,
		inputEmail,
		inputPhone,
		inputLogin,
		inputPassword1,
		inputPassword2
	];

	// Создаём экземпляры кнопок
	const buttonSubmit = new Button({
		name: 'submit',
		type: 'submit',
		text: 'Регистрация'
	});
	const buttonCancel = new Button({
		name: 'cancel',
		type: 'cancel',
		text: 'Отмена'
	});
	// Вставляем кноки в контент
	content.children.buttons=[buttonSubmit, buttonCancel];

	// Вызываем обновление чилдренов окна, в аргументах true - для рекурсии, чтобы вложенные
	// дочерние элементы тоже обновились
	window.updateChildren(true);


	return window;
}
