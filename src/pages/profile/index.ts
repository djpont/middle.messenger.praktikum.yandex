import tpl from './tpl.hbs';
import './style.scss';
import View from "~src/components/view";
import Window from "~src/components/window";
import Content from "~src/components/content";
import Alert from "~src/components/window/alert";
import Button from "~src/components/button";
import Input from "~src/components/input";
import Text from "~src/components/text";
import User from "~src/modules/user";
import {ComponentChildrenData} from "~src/components/components";
import Routing from "~src/modules/routing";
import fileUpload from "~src/pages/file-upload";
import Validator from "~src/modules/validator";
import Fetch from "~src/modules/fetch";
import {fetchDataFromInputs} from "~src/modules/functions";
import Form from "~src/components/form";

// Страничка профиля. Возвращает окно.

export default (rootElement: View): Window => {

	// Ссылка на аватарку текущего пользователя
	const myAvatar: string = User.getMyUser().data().avatar;

	// Создаём экземпляр класса отображения окон с сообщениями или ошибками
	const alert = new Alert({rootElement});

	// Создаём содержимое окна по шаблону
	const content = new Content({template: tpl, avatar: myAvatar});

	// Создаём окно с созданным выше содержимым
	const window = new Window({
		className: 'profile',
		title: 'Профиль пользователя',
		controls: {
			close: true
		},
		children: {
			content: [content]  // Передаем содержимое в чилдрены
		},
		close:
		// Добавляем действие на закрытие окна
			() => Routing('/messenger', rootElement)

	});
	// Вызываем обновление чилдренов окна
	// В аргументах true - для рекурсии, чтобы вложенные дочерние элементы тоже обновились
	window.updateChildren(true);

	// Находим форму, превращаем в экземпляр Form
	const form = Form.makeForm(content.document());

	// Метод для валидации инпутов
	function validate(input: Input) {
		Validator.validateInputWithAlert(input);
	}

	// Содержимое для режима просмотра профиля
	const contentWatch = (): ComponentChildrenData => {
		// Заполняем блок инпутов текстом
		const inputs = [
			new Text({text: `Почта: ${'email@email.com'}`}),
			new Text({text: `Логин: ${'djpont'}`}),
			new Text({text: `Имя: ${'Александр'}`}),
			new Text({text: `Фамилия: ${'Вотяков'}`}),
			new Text({text: `Имя в чате: ${'djpont'}`}),
			new Text({text: `Телефон: ${'+79999999999'}`})
		];
		// Создаём экземпляры кнопок и добавляем им действия
		const buttonEdit = new Button({
			name: 'edit',
			type: 'button',
			text: 'Изменить данные',
			events: {
				'click': () => contentOpen(contentEdit())
			}
		});
		const buttonChangePassword = new Button({
			name: 'changePassword',
			type: 'button',
			text: 'Изменить пароль',
			events: {
				'click': () => contentOpen(contentChangePassword())
			}
		});
		const buttonClose = new Button({
			name: 'close',
			type: 'button',
			text: 'Закрыть',
			events: {
				'click': window.close
			}
		});
		// Вставляем кноки в контент
		const buttons = [buttonEdit, buttonChangePassword, buttonClose];
		// Очищаем слушателей формы
		form.props.events = {};
		return {inputs, buttons};
	}

	// Содержимое для режима редактирования профиля
	const contentEdit = (): ComponentChildrenData => {
		// Создаём экземпляры инпутов
		const inputEmail = new Input({
			type: 'email',
			name: 'email',
			label: 'Почта:',
			isStacked: true,
			events: {
				'focusout': () => {
					validate(inputEmail);
				}
			}
		});
		const inputLogin = new Input({
			type: 'text',
			name: 'login',
			label: 'Логин:',
			isStacked: true,
			events: {
				'focusout': () => {
					validate(inputLogin);
				}
			}
		});
		const inputFirstName = new Input({
			type: 'text',
			name: 'first_name',
			label: 'Имя:',
			isStacked: true,
			events: {
				'focusout': () => {
					validate(inputFirstName);
				}
			}
		});
		const inputSecondName = new Input({
			type: 'text',
			name: 'second_name',
			label: 'Фамилия:',
			isStacked: true,
			events: {
				'focusout': () => {
					validate(inputSecondName);
				}
			}
		});
		const inputDisplayName = new Input({
			type: 'text',
			name: 'display_name',
			label: 'Имя в чате:',
			isStacked: true
		});
		const inputPhone = new Input({
			type: 'text',
			name: 'phone',
			label: 'Телефон:',
			isStacked: true,
			events: {
				'focusout': () => {
					validate(inputPhone);
				}
			}
		});
		const inputs = [
			inputEmail,
			inputLogin,
			inputFirstName,
			inputSecondName,
			inputDisplayName,
			inputPhone
		];

		// Создаём экземпляры кнопок и добавляем им действия
		const buttonSave = new Button({
			name: 'save',
			type: 'submit',
			text: 'Сохранить'
		});
		const buttonBack = new Button({
			name: 'back',
			type: 'button',
			text: 'Назад',
			events: {
				'click': () => contentOpen(contentWatch())
			}
		});
		const buttons = [buttonSave, buttonBack];

		// Создаём кнопку изменения аватара
		const buttonAvatar = new Button({
			name: 'avatar',
			type: 'button',
			text: 'Изменить аватар',
			events: {
				'click': () => alert.alertWindow(fileUpload())
			}
		});
		const avatar = [buttonAvatar];

		// Добавляем действие форме
		form.props.events = {
			'submit': (e: SubmitEvent) => {
				e.preventDefault();
				// Сначала првоеряем, что нет показанных сообщений после change input
				if (rootElement.children.alert.length > 0) {
					return;
				}
				// Сначала проверяем валидацию инпутов
				const formValid = Validator.validateInputWithAlert(
					inputFirstName,
					inputSecondName,
					inputEmail,
					inputPhone,
					inputLogin
				);
				// Если успешно, то выполянем запрос
				if (formValid) {
					const data = fetchDataFromInputs(
						inputFirstName,
						inputSecondName,
						inputEmail,
						inputPhone,
						inputLogin
					);
					console.log(data);
					Fetch.post({
						path: '/profile',
						data
					});
				}
			}
		};

		return {inputs, buttons, avatar};
	}

	// Содержимое для режима изменения пароля
	const contentChangePassword = (): ComponentChildrenData => {
		// Создаём экземпляры инпутов
		const inputOldPassword = new Input({
			type: 'password',
			name: 'oldPassword',
			label: 'Старый пароль:',
			isStacked: true
		});
		const inputNewPassword1 = new Input({
			type: 'password',
			name: 'password',
			label: 'Новый пароль:',
			isStacked: true,
			events: {
				'focusout': () => {
					validate(inputNewPassword1);
				}
			}
		});
		const inputNewPassword2 = new Input({
			type: 'password',
			name: 'password2',
			label: 'Новый пароль ещё раз:',
			isStacked: true
		});
		const inputs = [
			inputOldPassword,
			inputNewPassword1,
			inputNewPassword2
		];

		// Создаём экземпляры кнопок и добавляем им действия
		const buttonSave = new Button({
			name: 'save',
			type: 'submit',
			text: 'Сохранить'
		});
		const buttonBack = new Button({
			name: 'back',
			type: 'button',
			text: 'Назад',
			events: {
				'click': () => contentOpen(contentWatch())
			}
		});
		const buttons = [buttonSave, buttonBack];

		// Добавляем действие форме
		form.props.events = {
			'submit': (e: SubmitEvent) => {
				e.preventDefault();
				// Сначала првоеряем, что нет показанных сообщений после change input
				if (rootElement.children.alert.length > 0) {
					return;
				}
				// Проверяем, что пароль проходит валидацию
				if(Validator.validateInputWithAlert(inputNewPassword1)){
					// Проверяем, что введённые пароли одинаковые
					if (!Validator.equalInput([inputNewPassword1, inputNewPassword2])) {
						alert.error(['Введённые пароли отличаются.']);
					} else {
						// Если совпадают, то выполянем запрос
						const data = fetchDataFromInputs(
							inputOldPassword,
							inputNewPassword1,
							inputNewPassword2
						);
						console.log(data);
						Fetch.post({
							path: '/profile',
							data
						});
					}
				}
			}
		};

		return {inputs, buttons};
	}

	// Метод обновления содержимого контента
	const contentOpen = (children: ComponentChildrenData): void => {
		content.children = children;
		content.updateChildren(true);
	}

	// Изначально наполняем контент окна содержимым для просмотра профиля
	contentOpen(contentWatch());

	return window;
}
