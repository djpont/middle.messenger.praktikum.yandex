import tpl from './tpl.hbs';
import './style.scss';
import Component, {ComponentPropsData} from "~src/components/components";
import Message from "~src/components/message";
import Chat, {chatData} from "~src/modules/chat";
import {generateDom} from "~src/functions";
import Button from "~src/components/button";
import Input from "~src/components/input";
import fileUpload from "~src/pages/file-upload";
import Alert from "~src/components/window/alert";
import Validater from "~src/modules/validater";

// Компонент chatFeed отвечает за ленту сообщений и поля для оптравки нового сообщения

// Тип данных для компонента chatFeed (пока не отличается от типа базового компонента)
type chatFeedData = ComponentPropsData;

// Класс ленты сообщений
export default class ChatFeed extends Component<chatFeedData> {

	constructor(props: chatFeedData) {
		// Сначала создаём базовый компонент  и рендерим его
		super(props);
		// Делаем кнопки управляемыми
		this._makeNewMessageFormActive();
	}

	// Метод рендера DOM-дерева ленты сообщений по шаблону
	protected override render(data: ComponentPropsData): HTMLElement {
		return generateDom(tpl(data));
	}

	// Метод превращения отрендеренных кнопок в управляемые экземпляры Button
	private _makeNewMessageFormActive():void {
		// Превращаем инпут для ввода сообщения в экземпляр Input
		const inputMessage = Input.makeInput(
			this.subElement('div.newMessage input[name="message"]')
		);
		// Превращаем кнопку для отправки сообщения в экземпляр Button
		Button.makeButton(
			this.subElement('div.newMessage button[type="submit"]'),
			[
				() => {
					const valide = Validater.validateInputWithAlert(inputMessage);
					if(valide){
						console.log('Метод отправки сообщения');
					}
				}
			]
		);
		// Превращаем кнопку для прикрепления файла в экземпляр Button
		Button.makeButton(
			this.subElement('div.newMessage button.attach'),
			[
				() => Alert.lastAlert().alertWindow(fileUpload())
			]
		);
	}

	// Метод обновления DOM-дерева после обновления пропса
	protected override updateProp(prop: string): void {
		switch (prop) {
			case 'title':
				this.subElement('div.header div.chatName').textContent = this.props[prop];
				break;
			case 'avatar':
				this.subElement('div.header div.avatar').style.backgroundImage =
					`url('${this.props[prop]}')`;
				break;
		}
	}

	// Метод получения пропса из DOM-дерева
	protected override getProp(): { fromDom: boolean; value: unknown } {
		const result = {
			fromDom: false,
			value: ''
		}
		return result;
	}

	// Метод рендера ленты сообщений конкретного чата
	// (вызывается при клике на превью чата в списке чатов)
	public attachChat(chat: Chat): void {
		this._setChatProps(chat.data());
		this._clearMessages();
		chat.data().messages.forEach(message => {
			this.children.messages.push(new Message(message.data()));
		});
		this.updateChildren(true);
	}

	// Метод очистки ленты сообщений
	private _clearMessages() {
		// Очищаем чилдренов
		this.children.messages = [];
		this.updateChildren();
		// Убираем набранный текст из поля нового сообщения
		(this.subElement('div.newMessage input.text') as HTMLInputElement).value='';
	}

	// Делаем пропсы равными данным из переданного чата (заголовок и аватар)
	private _setChatProps(data: chatData): void {
		const {
			title,
			avatar
		} = data;
		this.props.title = title;
		this.props.avatar = avatar;
	}
}
