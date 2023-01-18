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
		loginLine:inputWithLabel({
			id:'login',
			name:'login',
			type:'text',
			label:'Логин:',
			isStacked: false
		}),
		passwordLine:inputWithLabel({
			id:'password',
			type:'password',
			name:'password',
			label:'Пароль:',
			isStacked:false
		}),
		buttonSubmit:button({
			id:'submit',
			name:'submit',
			type:'submit',
			value:'Вход'
		}),
		buttonRegister:button({
			id:'registration',
			name:'registration',
			type:'button',
			value:'Регистрация'
		})
	}));
	page.content().append(document);

	// Находим инпуты и кнопки на будущее
	const inputLogin = page.subElement('input#login');
	const inputPassword = page.subElement('input#password');
	const buttonSubmit = page.subElement('button#submit');
	const buttonRegister = page.subElement('button#registration');
}
