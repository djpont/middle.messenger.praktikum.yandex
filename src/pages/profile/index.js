import tpl_profile from './tpl_profile.hbs';
import './style.scss';
import Window from "/src/components/window";
import {button} from '/src/components/button';
import {inputWithLabel} from "/src/components/input";
import {generateDom} from "../../components/components";
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
				button({
					id:'edit',
					name:'edit',
					type:'button',
					value:'Изменить данные'
				}),
				button({
					id:'changePassword',
					name:'changePassword',
					type:'button',
					value:'Изменить пароль'}),
				button({
					id:'close',
					name:'close',
					type:'button',
					value:'Закрыть'
				})
			]
		}));
		page.content().clearHTML();
		page.content().append(document);
		const buttonEdit = page.subElement('button#edit');
		buttonEdit.addEventListener('click', openEdit);
		const buttonChangePassword = page.subElement('button#changePassword');
		buttonChangePassword.addEventListener('click', openChangePassword);
	}
	
	// Метод генерации контента при редактировании профиля
	const openEdit = () => {
		const document=generateDom(tpl_profile({
			avatar:myAvatar,
			infoLines:[
				inputWithLabel({
					id:'email',
					type:'email',
					name:'email',
					label:'Почта:',
					isStacked:true
				}),
				inputWithLabel({
					id:'login',
					type:'text',
					name:'login',
					label:'Логин:',
					isStacked:true
				}),
				inputWithLabel({
					id:'first_name',
					type:'text',
					name:'first_name',
					label:'Имя:',
					isStacked:true
				}),
				inputWithLabel({
					id:'second_name',
					type:'text',
					name:'second_name',
					label:'Фамилия:',
					isStacked:true
				}),
				inputWithLabel({
					id:'display_name',
					type:'text',
					name:'display_name',
					label:'Имя в чате:',
					isStacked:true
				}),
				inputWithLabel({
					id:'phone',
					type:'text',
					name:'phone',
					label:'Телефон:',
					isStacked:true
				}),
			],
			buttonChangeAvatar:button({
				id:'avatar',
				name:'avatar',
				value:'Изменить аватар'
			}),
			buttons:[
				button({
					id:'save',
					type:'submit',
					name:'save',
					value:'Сохранить'
				}),
				button({
					id:'back',
					type:'button',
					name:'back',
					value:'Назад'
				})
			]
		}));
		page.content().clearHTML();
		page.content().append(document);
		const buttonBack = page.subElement('button#back');
		buttonBack.addEventListener('click', openWatch);
	}
	
	
	// Метод генерации контента при изменении пароля
	const openChangePassword = () => {
		const document=generateDom(tpl_profile({
			avatar:myAvatar,
			infoLines:[
				inputWithLabel({
					id:'oldPassword',
					type:'password',
					name:'oldPassword',
					label:'Старый пароль:',
					isStacked:true
				}),
				inputWithLabel({
					id:'newPassword',
					type:'password',
					name:'newPassword',
					label:'Новый пароль:',
					isStacked:true
				}),
				inputWithLabel({
					id:'newPassword2',
					type:'password',
					name:'newPassword2',
					label:'Новый пароль ещё раз:',
					isStacked:true
				}),
			],
			buttons:[
				button({
					id:'save',
					name:'save',
					type:'submit',
					value:'Сохранить'
				}),
				button({
					id:'back',
					name:'back',
					type:'button',
					value:'Назад'
				})
			]
		}));
		page.content().clearHTML();
		page.content().append(document);
		const buttonBack = page.subElement('button#back');
		buttonBack.addEventListener('click', openWatch);
	}
	
	openWatch();
	
}
