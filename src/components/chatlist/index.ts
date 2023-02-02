import tpl_chatlist from './tpl_chatlist.hbs';
import tpl_chatPreview from './tpl_chat_preview.hbs';
import './style.scss';
import Component, {ComponentPropsData} from "~src/components/components";
import ChatFeed from "~src/components/chat-feed";
import {messageData} from "~src/modules/message";
import Chat from "~src/modules/chat";
import {Fn, generateDom} from "~src/functions";

// Компонент Chatlist отвечает за список чатов
// Состоит из превью чата и списка превьюшек

// Тип данных для превью
type chatPreviewData = {
	name: string,
	time: string,
	avatar: string,
	text: string,
	unreadCount: number
}

// Метод рендера HTML-строки превьюшки по шаблону
function chatPreview(data: chatPreviewData): string {
	return tpl_chatPreview(data);
}

// Тип данных для чатлиста
type chatlistData = {
	chatFeed: ChatFeed
} & ComponentPropsData;

// Метод рендера HTML-строки чатлиста по шаблону
// Передаём callback - действие при клика на превьюшку
const chatlist = (data: chatlistData, callback: Fn<void>):HTMLElement => {
	// Сначала создаём DOM-дерево по шаблону
	const chatlistDom = generateDom(tpl_chatlist(data));
	// Залем перебираем чаты и добавляем их превью в DOM-дерево
	Chat.getChatsList().forEach(chat => {
		const lastMessage: messageData = chat.getLastMessage().data();
		const unreadCount = 1; // Количество непрочитанных, пока у всех = 1
		const chatPreviewData: chatPreviewData = {
			name: chat.data().title,
			avatar: chat.data().avatar,
			text: lastMessage.text,
			time: new Date(lastMessage.datetime).toTimeString().slice(0, 5),
			unreadCount
		};
		// Создаём DOM-дерево превьюшки
		const chatPreviewDom = generateDom(chatPreview(chatPreviewData));
		chatlistDom.append(chatPreviewDom);
		// Добавляем действие при клике
		function chatPreviewCallback() {
			callback(chat, this);
		}
		chatPreviewDom.onclick = chatPreviewCallback;
	});
	return chatlistDom;
}

// Класс чатлиста
export default class Chatlist extends Component<chatlistData> {

	constructor(props: chatlistData) {
		// Сначала создаём базовый компонент  и рендерим его
		super(props);
	}

	// Метод открытия чата (вызывается при клике на превью чата)
	public openChat(chat: Chat, preview:HTMLElement): void {
		// Сначала убираем класс active у всех превью, затем добавляем нажатому
		Array.from(this.subElements('button.chatPreview.active')).forEach(el => {
			el.classList.remove('active');
		});
		preview.classList.add('active');
		// Вызываем метод attachChat у Ленты Сообщений
		if(this.props.chatFeed instanceof ChatFeed){
			this.props.chatFeed.attachChat(chat);
		}else{
			console.error('Не указан chatFeed для chatlist');
		}
	}

	// Метод рендера DOM-дерева кнопки по шаблону
	protected override render(data: chatlistData): HTMLElement {
		return chatlist(data, this.openChat.bind(this));
	}

	// Метод получения пропса из DOM-дерева
	protected override getProp(): { fromDom: boolean; value: unknown } {
		const result = {
			fromDom: false,
			value: ''
		}
		return result;
	}

	// Метод обновления DOM-дерева после обновления пропса (пока таких нет)
	protected override updateProp(): void {
		return;
	}
}
