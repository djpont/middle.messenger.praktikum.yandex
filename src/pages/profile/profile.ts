import tpl from './tpl.hbs';
import './style.scss';
import Window from "../../components/window";
import Content from "../../components/content";
import Alert from "../../components/window/alert";
import Button from "../../components/button";
import Input from "../../components/input";
import Text from "../../components/text";
import {ComponentChildrenData, ComponentPropsData} from "../../components/components";
import FileUpload from "../file-upload";
import Validator from "../../modules/validator";
import Form from "../../components/form";
import Api from "../../modules/api";
import {Fn, validate, fetchDataFromInputs} from "../../modules/functions";


// Страничка профиля. Возвращает окно.

export type profilePropsType = {
	email?: string,
	login?: string,
	first_name?: string,
	second_name?: string,
	display_name?: string,
	phone?: string,
	avatar?: string,
	avatarText?: string
} & ComponentPropsData;

export default class Profile extends Window{

	private _form:Form;

	constructor(props: profilePropsType) {
		// Создаём содержимое окна по шаблону
		const content = new Content({
			template: tpl,
			avatar: props.avatar,
			avatarText: props.avatarText,
			destroyable: false
		});
		super(Object.assign(props, {
			className: 'profile',
			title: 'Профиль пользователя',
			controls: {
				close: true
			},
			children: {
				content: [content]  // Передаем содержимое в чилдрены
			}
		}));
		this.updateChildren(true);

		// Находим форму, превращаем в экземпляр Form
		this._form = Form.makeForm(content.document());

		// Изначально наполняем контент окна содержимым для просмотра профиля
		this._contentOpen(this._contentWatch());
	}

	// Содержимое для режима редактирования профиля
	private _contentEdit(): ComponentChildrenData {
		const currentUser = this.props as profilePropsType;
		// Создаём экземпляры инпутов
		const inputEmail = new Input({
			type: 'email',
			name: 'email',
			label: 'Почта:',
			value: currentUser.email,
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
			value: currentUser.login,
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
			value: currentUser.first_name,
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
			value: currentUser.second_name,
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
			value: currentUser.display_name,
			isStacked: true
		});
		const inputPhone = new Input({
			type: 'text',
			name: 'phone',
			label: 'Телефон:',
			value: currentUser.phone,
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
				'click': () => this._contentOpen(this._contentWatch())
			}
		});
		const buttons = [buttonSave, buttonBack];

		// Создаём кнопку изменения аватара
		const buttonAvatar = new Button({
			name: 'avatar',
			type: 'button',
			text: 'Изменить аватар',
			events: {
				'click': () => Alert.alertWindow(new FileUpload({callback: avatarUpload}))
			}
		});
		const avatar = [buttonAvatar];

		// Функция обновления аватарки
		const avatarUpload: Fn<void, File> = (file: File) => {
			[...buttons, ...avatar].forEach(button => button.target().disabled = true);
			Api.editAvatar(file)
				.then(() => {
					this._contentOpen(this._contentWatch());
				})
				.catch(err => {
					Alert.error([err.reason]);
				})
		}

		// Добавляем действие форме
		this._form.props.events = {
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
					inputLogin
				);
				// Если успешно, то выполянем запрос
				if (formValid) {
					const data = fetchDataFromInputs(
						inputFirstName,
						inputSecondName,
						inputEmail,
						inputPhone,
						inputLogin,
						inputDisplayName
					);
					[...buttons, ...avatar].forEach(button => button.target().disabled = true);
					Api.editProfile(data)
						.then(() => {
							this._contentOpen(this._contentWatch());
						})
						.catch(err => {
							Alert.error([err.reason]);
						});
				}
			}
		};

		return {inputs, buttons, avatar};
	}

	// Содержимое для режима изменения пароля
	private _contentChangePassword(): ComponentChildrenData {
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
			name: 'newPassword',
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
				'click': () => this._contentOpen(this._contentWatch())
			}
		});
		const buttons = [buttonSave, buttonBack];

		// Добавляем действие форме
		this._form.props.events = {
			'submit': (e: SubmitEvent) => {
				e.preventDefault();
				// Сначала првоеряем, что нет показанных сообщений после change input
				if (!Alert.isEmpty()) {
					return;
				}
				// Проверяем, что пароль проходит валидацию
				if (Validator.validateInputWithAlert(inputNewPassword1)) {
					// Проверяем, что введённые пароли одинаковые
					if (!Validator.equalInput([inputNewPassword1, inputNewPassword2])) {
						Alert.error(['Введённые пароли отличаются.']);
					} else {
						// Если совпадают, то выполянем запрос
						const data = fetchDataFromInputs(
							inputOldPassword,
							inputNewPassword2
						);
						Api.changePassword(data)
							.then(() => {
								Alert.message(['Пароль изменен']);
								this._contentOpen(this._contentWatch());
							})
							.catch(res => {
								if(res.reason==='Password is incorrect'){
									res.reason='Старый пароль введен неверно'
								}
								Alert.error([res.reason]);
							});
					}
				}
			}
		};

		return {inputs, buttons};
	}

	// Содержимое для режима просмотра профиля
	private _contentWatch(): ComponentChildrenData {
		// Заполняем блок инпутов текстом
		const currentUser = this.props as profilePropsType;
		const inputs = [
			new Text({text: `Почта: ${currentUser.email}`}),
			new Text({text: `Логин: ${currentUser.login}`}),
			new Text({text: `Имя: ${currentUser.first_name}`}),
			new Text({text: `Фамилия: ${currentUser.second_name}`}),
			new Text({text: `Имя в чате: ${currentUser.display_name}`}),
			new Text({text: `Телефон: ${currentUser.phone}`})
		];
		// Создаём экземпляры кнопок и добавляем им действия
		const buttonEdit = new Button({
			name: 'edit',
			type: 'button',
			text: 'Изменить данные',
			events: {
				'click': () => this._contentOpen(this._contentEdit())
			}
		});
		const buttonChangePassword = new Button({
			name: 'changePassword',
			type: 'button',
			text: 'Изменить пароль',
			events: {
				'click': () => this._contentOpen(this._contentChangePassword())
			}
		});
		const buttonClose = new Button({
			name: 'close',
			type: 'button',
			text: 'Закрыть',
			events: {
				'click': this.close
			}
		});
		// Вставляем кноки в контент
		const buttons = [buttonEdit, buttonChangePassword, buttonClose];
		// Очищаем слушателей формы
		this._form.props.events = {};
		return {inputs, buttons};
	}

	// Метод обновления содержимого контента
	private _contentOpen(children: ComponentChildrenData): void {
		const content = this.children.content[0];
		content.children = children;
		content.updateChildren(true);
	}

	protected override _updateProp(prop: string): void {
		const content = this.children.content[0];
		switch (prop) {
			case 'avatar':
				content.subElement('div.avatarImage').style.backgroundImage =
					`url('${this.props.avatar}')`;
				break;
			case 'avatarText':
				content.subElement('div.avatarImage').textContent
					= (this.props as profilePropsType).avatarText ?? '';
				break;
		}
		this._contentOpen(this._contentWatch());
	}
}
