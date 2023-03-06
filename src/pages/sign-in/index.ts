import tpl from './tpl.hbs';
import "./style.scss";
import Window from "../../components/window";
import Content from "../../components/content";
import Alert from "../../components/window/alert";
import Input from "../../components/input";
import Button from "../../components/button";
import Routing from "../../modules/routing/routing";
import Validator from "../../modules/validator";
import {validate, fetchDataFromInputs} from "../../modules/functions/functions";
import Form from "../../components/form";
import Api from "../../modules/api";
import {PATHS} from "../../index";

// Страничка входа. Возвращает окно.

export default class PageSignIn extends Window{

	constructor() {
		// Создаём содержимое окна по шаблону
		const content = new Content({template: tpl});

		super({
			className: 'signIn',
			title: 'WinChat 98 - Электронные диалоги',
			controls: {
				close: false
			},
			children: {
				content: [content]  // Передаем содержимое в чилдрены
			}
		});

		// Создаём экземпляры инпутов
		const inputLogin = new Input({
			name: 'login',
			type: 'text',
			label: 'Логин:',
			isStacked: false,
			events: {
				'focusout': () => {
					validate(inputLogin);
				}
			}
		});
		const inputPassword = new Input({
			name: 'password',
			type: 'password',
			label: 'Пароль:',
			isStacked: false,
			events: {
				'focusout': () => {
					validate(inputPassword);
				}
			}
		});
		// Вставляем инпуты в контент
		content.children.inputs = [inputLogin, inputPassword];

		// Создаём экземпляры кнопок и ставляем кноки в контент
		const buttons = [
			new Button({
				name: 'submit',
				type: 'submit',
				text: 'Вход'
			}),
			new Button({
				name: 'registration',
				type: 'button',
				text: 'Регистрация',
				events: {
					'click': () => Routing.go('/sign-up')
				}
			})
		];
		content.children.buttons = buttons;

		// Находим форму, превращаем в экземпляр Form и вешаем события
		const form = Form.makeForm(content.document());
		form.props.events = {
			'submit': (e: SubmitEvent) => {
				e.preventDefault();
				// Сначала првоеряем, что нет показанных сообщений после change input
				if (!Alert.isEmpty()) {
					return;
				}
				// Проверяем валидацию инпутов
				const formValid = Validator.validateInputWithAlert(
					inputLogin,
					inputPassword
				);
				// Если успешно, то выполянем запрос
				if (formValid) {
					const data = fetchDataFromInputs(
						inputLogin,
						inputPassword
					)
					buttons.forEach(button => button.target().disabled = true);
					Api.signIn(data)
						.then(() => {
							Api.getMyUserInfo()
								.then(() => {
									Routing.go(PATHS.messenger);
								})
								.catch(() => {
									Alert.fatal([
										'Ошибка авторизации',
										'Проверьте, что в браузере включены куки'
									]);
								})
						})
						.catch(res => {
							if (res.reason === 'Login or password is incorrect') {
								res.reason = 'Неверный логин или пароль';
							}
							Alert.error([res.reason]);
							buttons.forEach(button => button.target().disabled = false);
						});
				}
			}
		};

		// Вызываем обновление чилдренов окна
		// В аргументах true - для рекурсии, чтобы вложенные дочерние элементы тоже обновились
		this.updateChildren(true);
	}
}
