import tpl from './tpl.hbs';
import Window from "~src/components/window";
import {Button} from "~src/components/button";
import {Input} from "~src/components/input";
import "./style.scss";
import Content from "~src/modules/content";
import {Component} from "~src/components/components";

export default (rootElement: HTMLElement): void => {

	// Генерируем окно
	const window: Window = new Window({
		className: 'signIn',
		title: 'WinChat 98 - Электронные диалоги'
	});
	rootElement.append(window.document());

	// Генерируем дерево для контента по шаблону
	const content:Content = new Content({
		template:tpl
	});
	window.windowBody().append(content.document());

	// Создаём экземпляры компонентов
	const inputLogin = new Input({
		name: 'login',
		type: 'text',
		label: 'Логин:',
		isStacked: false
	});
	const inputPassword = new Input({
		name: 'password',
		type: 'password',
		label: 'Пароль:',
		isStacked: false
	});
	const buttonSubmit = new Button({
		name: 'submit',
		type: 'submit',
		text: 'Вход'
	});
	const buttonRegister = new Button({
		name: 'registration',
		type: 'button',
		text: 'Регистрация'
	});

	// Добавляем экземпляры компонентов к странице
	content.addChildren({
		'inputs': [
			inputLogin,
			inputPassword
		],
		'buttons': [
			buttonSubmit,
			buttonRegister
		]
	});

	// Действие при клике на Вход
	const openRegisterPage = (): void => {
		document.location='/sign-up';
	}
	buttonRegister.eventBus.on(Component.EVENTS.buttonClick, openRegisterPage);

	// Действие при клике на Регистрация
	const openMessengerPage = (): void => {
		document.location='/messenger';
	}
	buttonSubmit.eventBus.on(Component.EVENTS.buttonClick, openMessengerPage);

}
