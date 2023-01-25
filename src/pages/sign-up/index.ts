import tpl from './tpl.hbs';
import Window from "~src/components/window";
import {Button} from "~src/components/button";
import {Input} from "~src/components/input";
import './style.scss';
import Content from "~src/modules/content";
import {Component} from "~src/components/components";

export default (rootElement: HTMLElement): void => {

	// Генерируем окно
	const window: Window = new Window({
		className: 'signUp',
		title: 'WinChat 98 - Регистрация',
		controls: {
			close: true
		}
	});
	rootElement.append(window.document());

	// Генерируем дерево для контента по шаблону
	const content:Content = new Content({
		template:tpl
	});
	window.windowBody().append(content.document());

	// Создаём экземпляры компонентов
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

	// Добавляем экземпляры компонентов к странице
	content.addChildren({
		'inputs': [
			inputFirstName,
			inputSecondName,
			inputEmail,
			inputPhone,
			inputLogin,
			inputPassword1,
			inputPassword2
		],
		'buttons': [
			buttonCancel,
			buttonSubmit
		]
	});

	// Действие при клике на Регистрация
	const submitRegistration = (): void => {
		console.log('submitRegistration');
	}
	buttonSubmit.eventBus.on(Component.EVENTS.buttonClick, submitRegistration);

	// Действие при клике на Отмена
	const openSignInPage = (): void => {
		document.location='/sign-in';
	}
	buttonCancel.eventBus.on(Component.EVENTS.buttonClick, openSignInPage);
	window.eventBus.on(Component.EVENTS.windowClose, openSignInPage);


}
