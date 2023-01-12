// import {joinDom} from '/src/functions';
import Window from "/src/components/window";
import Field from "/src/components/field";
import Button from '/src/components/button';
import Input from "../../components/input";

export default (rootElement) => {
	const page = new Window(
		'sign-up',
		'',
		'Регистрация в Мессенджере',
		'Введите данные для регистрации'
	);
	rootElement.append(page.document());
	
	const input_firstName = new Input('first_name', 'text', 'Имя:');
	const input_secondName = new Input('second_name', 'text', 'Фамилия:');
	const input_email = new Input('email', 'email', 'Почта:');
	const input_phone = new Input('phone', 'phone', 'Телефон:');
	const input_login = new Input('login', 'text', 'Логин:');
	const input_password1 = new Input('password1', 'password', 'Пароль:');
	const input_password2 = new Input('password2', 'password', 'Пароль (ещё раз):');
	const button_submit = new Button('submit', 'Зарегистрироваться');
	const button_cancel = new Button('cancel', 'Регистрация');
	
	const inputs_block = new Field([
		input_firstName,
		input_secondName,
		input_email,
		input_phone,
		input_login,
		input_password1,
		input_password2
	]);
	const buttons_block = new Field([
		button_submit,
		button_cancel
	]);
	
	
	page.content().append(inputs_block, buttons_block);
	
}