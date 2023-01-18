import tpl from './tpl.hbs';
import Window from "/src/components/window";
import {button} from '/src/components/button';
import {inputWithLabel} from "../../components/input";
import {generateDom} from "../../components/components";
import './style.scss';

export default (rootElement) => {
	
	// Генерируем окно
	const page = new Window(
		'sign-up',
		'sign-up',
		'WinChat 98 - Регистрация',// 'Регистрация в Мессенджере',
		{close:true}
	);
	rootElement.append(page.document());
	
	// Генерируем контент по шаблону
	const document=generateDom(tpl({
		nameLine:inputWithLabel('name', 'text', '', 'Имя:', true),
		surnameLine:inputWithLabel('surname', 'text', '', 'Фамилия:', true),
		emailLine:inputWithLabel('email', 'email', '', 'Адрес электронной почты:', true),
		phoneLine:inputWithLabel('phone', 'text', '', 'Телефон:', true),
		loginLine:inputWithLabel('login', 'text', '', 'Логин:', true),
		passwordLine1:inputWithLabel('password1', 'password', '', 'Пароль:', true),
		passwordLine2:inputWithLabel('password2', 'password', '', 'Пароль ещё раз:', true),
		
		buttonSubmit:button('submit', 'ОК'),
		buttonCancel:button('registration', 'Отмена')
	}));
	page.content().append(document);
	
}
