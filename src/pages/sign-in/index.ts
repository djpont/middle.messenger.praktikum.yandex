import tpl from './tpl.hbs';
import Window from "~src/components/window";
import {Button} from "~src/components/button";
import {Input} from "~src/components/input";
import "./style.scss";
import Content from "~src/modules/content";

export default (rootElement: HTMLElement): void => {

	const page: Window = new Window({
		className: 'signIn',
		title: 'WinChat 98 - Электронные диалоги'
	});
	rootElement.append(page.document());

	const content:Content = new Content({
		template:tpl
	});

	page.windowBody().append(content.document());

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

	const openRegisterPage = (): void => {
		document.location='/sign-up';
	}
	buttonRegister.eventBus.on('click', openRegisterPage);

	const openMessengerPage = (): void => {
		document.location='/messenger';
	}
	buttonSubmit.eventBus.on('click', openMessengerPage);

}
