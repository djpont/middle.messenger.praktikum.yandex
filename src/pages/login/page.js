import {joinDom} from '/src/functions';
import Window from "/src/components/window";
import Field from "/src/components/field";
import Button from '/src/components/button';
import Input from "../../components/input";


export default (rootElement) => {
	const window_login = new Window(
		'window_login',
		'',
		'Добро пожаловать в Мессенджер',
		'Введите имя и пароль для входа'
	);
	rootElement.append(window_login.document());
	
	const input_login = new Input('login', 'text','Логин:');
	const input_password = new Input('password', 'text','Пароль:');
	const button_submit = new Button('btn1', 'Ок');
	const button_register = new Button('btn2', 'Регистрация');
	
	const buttons_block = new Field([button_submit, button_register]);
	const inputs_block = new Field([input_login, input_password]);
	
	// const inputs = joinDom(
	// 	input_login,
	// 	input_password
	// );

	window_login.content().append(inputs_block, buttons_block);
	// console.log(window_login.document());
	
}