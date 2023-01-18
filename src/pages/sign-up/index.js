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
		nameLine:inputWithLabel({
			id:'name',
			type:'text',
			name:'name',
			label:'Имя:',
			isStacked:true
		}),
		surnameLine:inputWithLabel({
			id:'surname',
			type:'text',
			name:'surname',
			label:'Фамилия:',
			isStacked:true
		}),
		emailLine:inputWithLabel({
			id:'email',
			type:'email',
			name:'email',
			label:'Адрес электронной почты:',
			isStacked:true
		}),
		phoneLine:inputWithLabel({
			id:'phone',
			type:'text',
			name:'phone',
			label:'Телефон:',
			isStacked:true
		}),
		loginLine:inputWithLabel({
			id:'login',
			type:'text',
			name:'login',
			label:'Логин:',
			isStacked:true
		}),
		passwordLine1:inputWithLabel({
			id:'password1',
			type:'password',
			name:'password',
			label:'Пароль:',
			isStacked:true
		}),
		passwordLine2:inputWithLabel({
			id:'password2',
			type:'password',
			name:'password2',
			label:'Пароль ещё раз:',
			isStacked:true
		}),
		
		buttonSubmit:button({
			id:'submit',
			name:'submit',
			type:'submit',
			value:'Регистрация'
		}),
		buttonCancel:button({
			id:'cancel',
			name:'cancel',
			type:'button',
			value:'Отмена'
		})
	}));
	page.content().append(document);
	
}
