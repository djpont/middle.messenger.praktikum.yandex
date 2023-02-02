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
import Validater from "~src/modules/validater";

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
		events: [
			// Добавляем действие на закрытие окна
			() => Routing('/messenger', rootElement)
		]
	});
	// Вызываем обновление чилдренов окна
	// В аргументах true - для рекурсии, чтобы вложенные дочерние элементы тоже обновились
	window.updateChildren(true);

	// Метод для валидации инпутов
	function validate(input: Input) {
		Validater.validateInputWithAlert(input);
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
			events: [
				() => contentOpen(contentEdit())
			]
		});
		const buttonChangePassword = new Button({
			name: 'changePassword',
			type: 'button',
			text: 'Изменить пароль',
			events: [
				() => contentOpen(contentChangePassword())
			]
		});
		const buttonClose = new Button({
			name: 'close',
			type: 'button',
			text: 'Закрыть',
			events: [
				window.close
			]
		});
		// Вставляем кноки в контент
		const buttons = [buttonEdit, buttonChangePassword, buttonClose];
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
			events: [
				validate
			]
		});
		const inputLogin = new Input({
			type: 'text',
			name: 'login',
			label: 'Логин:',
			isStacked: true,
			events: [
				validate
			]
		});
		const inputFirstName = new Input({
			type: 'text',
			name: 'first_name',
			label: 'Имя:',
			isStacked: true,
			events: [
				validate
			]
		});
		const inputSecondName = new Input({
			type: 'text',
			name: 'second_name',
			label: 'Фамилия:',
			isStacked: true,
			events: [
				validate
			]
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
			events: [
				validate
			]
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
			text: 'Сохранить',
			events: [
				() => {
					const formValid = Validater.validateInputWithAlert(
						inputFirstName,
						inputSecondName,
						inputEmail,
						inputPhone,
						inputLogin
					);
					if(formValid){
						console.log('Метод сохранения данных профиля');
					}
				}
			]
		});
		const buttonBack = new Button({
			name: 'back',
			type: 'button',
			text: 'Назад',
			events: [
				() => contentOpen(contentWatch())
			]
		});
		const buttons = [buttonSave, buttonBack];

		// Создаём кнопку изменения аватара
		const buttonAvatar = new Button({
			name: 'avatar',
			type: 'button',
			text: 'Изменить аватар',
			events: [
				() => alert.alertWindow(fileUpload())
			]
		});
		const avatar = [buttonAvatar];

		return {inputs, buttons, avatar};
	}

	// Содержимое для режима изменения пароля
	const contentChangePassword = (): ComponentChildrenData => {
		console.log('contentChangePassword');
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
			events: [
				validate
			]
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
			text: 'Сохранить',
			events: [
				() => {
					if(!Validater.equalInput([inputNewPassword1, inputNewPassword2])){
						alert.error(['Введённые пароли отличаются.']);
					}else{
						console.log('Метод сохранния нового пароля пользователя');
					}
				}
			]
		});
		const buttonBack = new Button({
			name: 'back',
			type: 'button',
			text: 'Назад',
			events: [
				() => contentOpen(contentWatch())
			]
		});
		const buttons = [buttonSave, buttonBack];

		return {inputs, buttons};
	}

	// Метод обновления содержимого контента
	const contentOpen = (children: ComponentChildrenData):void => {
		content.children=children;
		content.updateChildren(true);
	}

	// Изначально наполняем контент окна содержимым для просмотра профиля
	contentOpen(contentWatch());

	return window;
}
