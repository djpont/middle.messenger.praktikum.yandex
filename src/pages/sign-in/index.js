import tpl from './tpl.hbs';
import Window from "/src/components/window";
import {button} from '/src/components/button';
import {inputWithLabel} from "../../components/input";
import "./style.scss";
import {generateDom} from "../../components/components";

export default (rootElement) => {

	// Генерируем окно
	const page = new Window(
		'sign-in',
		'sign-in',
		'WinChat 98 - Электронные диалоги', //'Добро пожаловать в Мессенджер'
	);
	rootElement.append(page.document());


	// Генерируем контент окна по шаблону
	const document=generateDom(tpl({
		loginLine:inputWithLabel('login', 'text', '', 'Логин:', false),
		passwordLine:inputWithLabel('password', 'text', '', 'Пароль:', false),
		buttonSubmit:button('submit', 'Вход'),
		buttonRegister:button('registration', 'Регистрация')
	}));
	page.content().append(document);

	// Находим инпуты и кнопки на будущее
	const inputLogin = page.subElement('input#login');
	const inputPassword = page.subElement('input#password');
	const buttonSubmit = page.subElement('button#submit');
	const buttonRegister = page.subElement('button#registration');
}
