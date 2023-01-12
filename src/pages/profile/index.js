// import {joinDom} from '/src/functions';
import Window from "/src/components/window";
import Field from "/src/components/field";
import Button, {button} from '/src/components/button';
import Input from "/src/components/input";
import Infostring, {infostring} from "/src/components/infostring";
import Avatar, {avatar} from "/src/components/avatar";
import {joinHTML} from "../../functions";
import {generateDom} from "../../components/components";

export default (rootElement, user) => {
	const page = new Window(
		'profile',
		'',
		'Профиль пользователя'
	);
	rootElement.append(page.document());
	
	const informationWatchingBlock = generateDom(joinHTML([
		avatar('', 'big'),
		infostring('Почта:', 'email'),
		infostring('Логин:', 'djpont'),
		infostring('Имя:', 'email'),
		infostring('Фамилия:', 'email'),
		infostring('Имя в чате:', 'email'),
		infostring('Телефон:', 'email')
	], true));
	
	const input_avatar = new Avatar('', 'big');
	const input_email = new Input('email', 'email', 'Почта:');
	const input_login = new Input('login', 'text', 'Логин:');
	const input_name = new Input('name', 'text', 'Имя:');
	const input_surname = new Input('surname', 'text', 'Фамилия:');
	const input_nameInChat = new Input('nameInChat', 'text', 'Имя в чате:');
	const input_phone = new Input('phone', 'phone', 'Телефон:');
	
	const informationEditingBlock = new Field([
		input_avatar,
		input_email,
		input_login,
		input_name,
		input_surname,
		input_nameInChat,
		input_phone
	], 'editing');
	
	const input_passwordOld = new Input('passwordOld', 'password', 'Старый пароль:');
	const input_passwordNew1 = new Input('passwordNew1', 'password', 'Новый пароль:');
	const input_passwordNew2 = new Input('passwordNew2', 'password', 'Новый пароль ещё раз:');
	
	const informationChangePasswordBlock = new Field([
		input_passwordOld,
		input_passwordNew1,
		input_passwordNew2
	], 'editing');
	
	
	const button_change_info = new Button('btn1', 'Изменить данные');
	const button_change_password = new Button('btn2', 'Изменить пароль');
	const button_close = new Button('btn3', 'Закрыть');
	const button_save = new Button('btn4', 'Сохранить');
	
	const buttonsWatchingBlock = new Field([
		button_change_info,
		button_change_password,
		button_close
	]);
	
	const buttonsEditingBlock = new Field([
		button_save
	]);
	
	const open_watching = () => {
		page.content().clearHTML();
		page.content().append(informationWatchingBlock, buttonsWatchingBlock);
	}
	const open_editing = () => {
		page.content().clearHTML();
		page.content().append(informationEditingBlock, buttonsEditingBlock);
		button_save.action(open_watching);
	}
	const open_changePassword = () => {
		page.content().clearHTML();
		page.content().append(informationChangePasswordBlock, buttonsEditingBlock);
		button_save.action(open_watching);
	}
	
	button_change_info.action(open_editing);
	button_change_password.action(open_changePassword);
	
	open_watching();
}