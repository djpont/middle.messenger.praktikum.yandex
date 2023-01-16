import tpl_profile from './tpl_profile.hbs';
import Window from "/src/components/window";
import {button} from '/src/components/button';
import {inputWithLabel} from "/src/components/input";
import {generateDom} from "../../components/components";
import './style.css';
import User from "../../modules/user";

export default (rootElement) => {
	
	// Генерируем окно
	const page = new Window(
		'profile',
		'profile',
		'Профиль пользователя',
		{close:true}
	);
	rootElement.append(page.document());
	
	const myAvatar=User.getMyUser().data().avatar;
	
	// Метод генерации контента при просмотре профиля
	const openWatch = () => {
		const document=generateDom(tpl_profile({
			avatar:myAvatar,
			infoLines:[
				`Почта: ${'email@email.com'}`,
				`Логин: ${'djpont'}`,
				`Имя: ${'Александр'}`,
				`Фамилия: ${'Вотяков'}`,
				`Имя в чате: ${'djpont'}`,
				`Телефон: ${'+79999999999'}`
			],
			buttons:[
				button('edit', 'Изменить данные'),
				button('changePassword', 'Изменить пароль'),
				button('close', 'Закрыть')
			]
		}));
		page.content().clearHTML();
		page.content().append(document);
		const buttonEdit = page.subElement('button#edit');
		buttonEdit.addEventListener('click', openEdit);
	}
	
	// Метод генерации контента при редактировании профиля
	const openEdit = () => {
		const document=generateDom(tpl_profile({
			avatar:myAvatar,
			infoLines:[
				inputWithLabel('email', 'email', '', 'Почта:', true),
				inputWithLabel('login', 'text', '', 'Логин:', true),
				inputWithLabel('name', 'text', '', 'Имя:', true),
				inputWithLabel('surname', 'text', '', 'Фамилия:', true),
				inputWithLabel('nickname', 'text', '', 'Имя в чате:', true),
				inputWithLabel('phone', 'text', '', 'Телефон:', true),
			],
			buttonChangeAvatar:button('changeAvatar', 'Изменить аватар'),
			buttons:[
				button('save', 'Сохранить'),
				button('back', 'Назад')
			]
		}));
		page.content().clearHTML();
		page.content().append(document);
		const buttonBack = page.subElement('button#back');
		buttonBack.addEventListener('click', openWatch);
	}
	
	openWatch();
	
}