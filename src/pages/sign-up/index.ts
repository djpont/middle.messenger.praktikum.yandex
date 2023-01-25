import tpl from './tpl.hbs';
import Window from "~src/components/window";
import {button} from "~src/components/button";
import {inputWithLabel} from "~src/components/input";
import {generateDom} from "~src/functions";
import './style.scss';

export default (rootElement: HTMLElement): void => {

	// Генерируем окно
	const page: Window = new Window({
		id: 'signUp',
		className: 'signUp',
		title: 'WinChat 98 - Регистрация',
		controls: {
			close: true
		}
	});
	rootElement.append(page.document());

	// Генерируем контент по шаблону
	const document: HTMLElement = generateDom(tpl({
		infoLines: [
			inputWithLabel({
				id: 'first_name',
				type: 'text',
				name: 'first_name',
				label: 'Имя:',
				isStacked: true
			}),
			inputWithLabel({
				id: 'second_name',
				type: 'text',
				name: 'second_name',
				label: 'Фамилия:',
				isStacked: true
			}),
			inputWithLabel({
				id: 'email',
				type: 'email',
				name: 'email',
				label: 'Адрес электронной почты:',
				isStacked: true
			}),
			inputWithLabel({
				id: 'phone',
				type: 'text',
				name: 'phone',
				label: 'Телефон:',
				isStacked: true
			}),
			inputWithLabel({
				id: 'login',
				type: 'text',
				name: 'login',
				label: 'Логин:',
				isStacked: true
			}),
			inputWithLabel({
				id: 'password',
				type: 'password',
				name: 'password',
				label: 'Пароль:',
				isStacked: true
			}),
			inputWithLabel({
				id: 'password2',
				type: 'password',
				name: 'password2',
				label: 'Пароль ещё раз:',
				isStacked: true
			})
		],
		buttonSubmit: button({
			id: 'submit',
			name: 'submit',
			type: 'submit',
			value: 'Регистрация'
		}),
		buttonCancel: button({
			id: 'cancel',
			name: 'cancel',
			type: 'button',
			value: 'Отмена'
		})
	}));
	page.content().append(document);

}
