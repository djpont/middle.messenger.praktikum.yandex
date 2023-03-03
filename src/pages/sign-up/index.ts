import tpl from './tpl.hbs';
import './style.scss';
import Window from "../../components/window";
import Content from "../../components/content";
import Alert from "../../components/window/alert";
import Input from "../../components/input";
import Button from "../../components/button";
import Routing from "../../modules/routing";
import Validator from "../../modules/validator";
import Api from "../../modules/api";
import Form from "../../components/form";
import {fetchDataFromInputs} from "../../modules/functions";
import {validate} from "../../modules/functions";
import {PATHS} from "../../index";

// Страничка регистрации. Возвращает окно.

export default class PageSignUp extends Window{

	constructor() {
		const content = new Content({template: tpl});

		super({
			className: 'signUp',
			title: 'WinChat 98 - Регистрация',
			controls: {
				close: true
			},
			children: {
				content: [content]  // Передаем содержимое в чилдрены
			},
			close: () => Routing.go('/sign-in')
		});

		// Создаём экземпляры инпутов
		const inputFirstName = new Input({
			name: 'first_name',
			type: 'text',
			label: 'Имя:',
			isStacked: true,
			events: {
				'focusout': () => {
					validate(inputFirstName);
				}
			}
		});
		const inputSecondName = new Input({
			name: 'second_name',
			type: 'text',
			label: 'Фамилия:',
			isStacked: true,
			events: {
				'focusout': () => {
					validate(inputSecondName);
				}
			}
		});
		const inputEmail = new Input({
			name: 'email',
			type: 'text',
			label: 'Адрес электронной почты:',
			isStacked: true,
			events: {
				'focusout': () => {
					validate(inputEmail);
				}
			}
		});
		const inputPhone = new Input({
			name: 'phone',
			type: 'text',
			label: 'Телефон:',
			isStacked: true,
			events: {
				'focusout': () => {
					validate(inputPhone);
				}
			}
		});
		const inputLogin = new Input({
			name: 'login',
			type: 'text',
			label: 'Логин:',
			isStacked: true,
			events: {
				'focusout': () => {
					validate(inputLogin);
				}
			}
		});
		const inputPassword1 = new Input({
			name: 'password',
			type: 'password',
			label: 'Пароль:',
			isStacked: true,
			events: {
				'focusout': () => {
					validate(inputPassword1);
				}
			}
		});
		const inputPassword2 = new Input({
			name: 'password2',
			type: 'password',
			label: 'Пароль ещё раз:',
			isStacked: true
		});
		// Вставляем инпуты в контент
		content.children.inputs = [
			inputFirstName,
			inputSecondName,
			inputEmail,
			inputPhone,
			inputLogin,
			inputPassword1,
			inputPassword2
		];

		// Создаём экземпляры кнопок
		const buttonSubmit = new Button({
			name: 'submit',
			type: 'submit',
			text: 'Регистрация'
		});
		const buttonCancel = new Button({
			name: 'cancel',
			type: 'cancel',
			text: 'Отмена',
			events: {
				'click': () => this.close()
			}
		});
		// Вставляем кноки в контент
		content.children.buttons = [buttonSubmit, buttonCancel];

		// Находим форму, превращаем в экземпляр Form и вешаем события
		const form = Form.makeForm(content.document());
		form.props.events = {
			'submit': (e: SubmitEvent) => {
				e.preventDefault();
				// Сначала првоеряем, что нет показанных сообщений после change input
				if (!Alert.isEmpty()) {
					return;
				}
				// Сначала проверяем валидацию инпутов
				const formValid = Validator.validateInputWithAlert(
					inputFirstName,
					inputSecondName,
					inputEmail,
					inputPhone,
					inputLogin,
					inputPassword1
				);
				// Если успешно, то проверяем, что пароли одинаковые
				if (formValid) {
					if (!Validator.equalInput([inputPassword1, inputPassword2])) {
						Alert.error(['Введённые пароли отличаются.']);
					} else {
						// Если успешно, то выполянем запрос
						const data = fetchDataFromInputs(
							inputFirstName,
							inputSecondName,
							inputEmail,
							inputPhone,
							inputLogin,
							inputPassword1
						)
						buttonSubmit.target().disabled = true;
						Api.signUp(data)
							.then(() => {
								Routing.go(PATHS.messenger);
							})
							.catch(res => {
								Alert.error([res.error, res.reason]);
								buttonSubmit.target().disabled = false;
							});
					}
				}
			}
		};

		// Вызываем обновление чилдренов окна, в аргументах true - для рекурсии, чтобы вложенные
		// дочерние элементы тоже обновились
		this.updateChildren(true);
	}
}
