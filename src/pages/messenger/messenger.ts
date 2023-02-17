import tpl from './tpl.hbs';
import './style.scss';
import Window from "~src/components/window";
import Content from "~src/components/content";
import Input from "~src/components/input";
import Button from "~src/components/button";
import Form from "~src/components/form";
import Auth from "~src/modules/auth";
import {ComponentPropsData} from "~src/components/components";
import Alert from "~src/components/window/alert";
import {activateTabs} from "~src/modules/functions";
import {UserlistSearchConnected, UserlistCurrentChatConnected} from "~src/components/userlist";
import Chatlist from "~src/components/chatlist";
import ChatFeedConnected from "~src/components/chatfeed";
import {Fn} from "~src/modules/functions";

// Страничка Мессенджера.
// Состоит из двух больших компонентов: Списка чатов (Chatlist) и Ленты сообщений (ChatFeed).

type messengerPropsType = {
	display_name?: string,
	avatar?: string,
	avatarText?: string,
	callbacks: callbacksType
} & ComponentPropsData;

type callbacksType = {
	optionsCallback?: Fn<void>,
	detailsCallback?: Fn<void>,
	logoutCallback?: Fn<void>
}

export default class Messenger extends Window {

	constructor(props: messengerPropsType) {
		// Создаём содержимое окна по шаблону
		const content = new Content({
			template: tpl,
			displayName: props.display_name,
			avatar: props.avatar,
			avatarText: props.avatarText,
			children: {
				details: [
					new Button({
						className: 'details',
						text: 'Детали',
						events: {
							'click': props.callbacks.detailsCallback as Fn<void>
						}
					})],
				create: [
					new Input({
						name: 'text',
						className: 'inputCreate'
					}),
					new Button({
						type: 'submit',
						className: 'buttonCreate',
						text: 'Создать'
					})],
				search: [
					new Input({
						name: 'text',
						className: 'inputSearch'
					}),
					new Button({
						type: 'submit',
						className: 'buttonSearch',
						text: 'Найти'
					})]
			},
			destroyable: false
		});

		// Делаем кнопки вкладок кликабельными
		const sidebarTabsEvents = activateTabs(content.document());

		// Форма создания чата и событие
		const createForm = Form.makeForm(content.subElement('form.create'));
		createForm.props.events = {
			'submit': (e: SubmitEvent) => {
				e.preventDefault();
				const data = createForm.getFormData();
				if (data.text && data.text.length > 0) {
					Auth.createChat(data.text)
						.then(() => {
							createForm.clearFormData();
						});
				}
			}
		}

		// Форма поиска и событие поиска
		const searchForm = Form.makeForm(content.subElement('form.search'));

		searchForm.props.events = {
			'submit': (e: SubmitEvent) => {
				e.preventDefault();
				const data = searchForm.getFormData();
				Auth.findUser({login: data.text})
					.then((res: unknown[]) => {
						if (res.length === 0) {
							Alert.message(['Не найдено']);
						}
					})
					.catch(res => {
						Alert.message([res.reason]);
					});
			}
		}

		super({
			className: 'messenger',
			title: 'WinChat 98 - Электронные диалоги',
			controls: {
				close: true
			},
			children: {
				content: [content]  // Передаем содержимое в чилдрены
			},
			close: () => {
				Auth.logout()
					.then(() => {
						(props.callbacks.logoutCallback as Fn<void>)();
					});
			}
		});

		// Вызываем обновление чилдренов окна
		// В аргументах true - для рекурсии, чтобы вложенные дочерние элементы тоже обновились
		this.updateChildren(true);

		// Лента сообщений чата
		const chatfeed = new ChatFeedConnected({
			callback: postMessageToChat,
			optionsCallback: props.callbacks.optionsCallback as Fn<void>
		});
		content.children.chatFeed = [chatfeed];

		function postMessageToChat(text: string): void {
			Auth.postNewMessage(text);
		}

		// Вкладка списка чатов
		const chatlist = new Chatlist({callback: chatlistClick});
		content.children.chatlist = [chatlist];

		function chatlistClick(id: string) {
			Auth.openChat(id);
			return;
		}

		// Вкладка добавления пользователя в чат
		const foundlist = new UserlistSearchConnected({callback: addUserToCurrentChat});
		content.children.foundlist = [foundlist];

		function addUserToCurrentChat(userId: string):void {
			const currentChatId = Auth.getCurrentChatId();
			if (currentChatId > 0) {
				Auth.addUserToChat(userId);
				Auth.clearFoundUsers();
				searchForm.clearFormData();
				sidebarTabsEvents['dialogs']();
			} else {
				Alert.message(['Сначала откройте чат, куда будет добавлен пользователь']);
			}
		}

		// Вкладка удаления пользователя из чата
		const userlist = new UserlistCurrentChatConnected({callback: deleteUserFromCurrentChat});
		content.children.userlist = [userlist];

		function deleteUserFromCurrentChat(userId: string):void {
			const currentChatId = Auth.getCurrentChatId();
			if (currentChatId > 0) {
				Auth.deleteUserFromChat(userId);
			}
		}

		// Вызываем
		content.updateChildren();
	}

	protected override _updateProp(prop: string): void {
		const content = this.children.content[0];
		switch (prop) {
			case 'avatar':
				content.subElement('div.avatar')
					.style.backgroundImage = `url('${this.props.avatar}')`;
				break;
			case 'avatarText':
				content.subElement('div.avatar')
					.textContent = this.props.avatarText as string ?? '';
				break;
			case 'display_name':
				content.subElement('div.displayName').textContent
					= `${this.props.display_name}`;
				break;
		}
	}
}