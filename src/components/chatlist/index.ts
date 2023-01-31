import tpl_chatlist from './tpl_chatlist.hbs';
import tpl_chatPreview from './tpl_chat_preview.hbs';
import './style.scss';
import Component, {ComponentPropsData} from "~src/components/components";
import ChatFeed from "~src/components/chat-feed";
import {messageData} from "~src/modules/message";
import Chat from "~src/modules/chat";
import {Fn, generateDom} from "~src/functions";

type chatPreviewData = {
	name: string,
	time: string,
	avatar: string,
	text: string,
	unreadCount: number
}

const chatPreview = (data: chatPreviewData): string => {
	return tpl_chatPreview(data);
};

type chatlistData = {
	chatFeed: ChatFeed
} & ComponentPropsData;

// Метод отрисовки содержимого чатлиста (список превьюшек чатов)
const chatlist = (data: chatlistData, callback: Fn<void>):HTMLElement => {
	const chatlistDom = generateDom(tpl_chatlist(data));
	Chat.getChatsList().forEach(chat => {
		const lastMessage: messageData = chat.getLastMessage().data();
		const unreadCount = 1;
		const chatPreviewData: chatPreviewData = {
			name: chat.data().title,
			avatar: chat.data().avatar,
			text: lastMessage.text,
			time: new Date(lastMessage.datetime).toTimeString().slice(0, 5),
			unreadCount
		};
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

export default class Chatlist extends Component<chatlistData> {

	constructor(props: chatlistData) {
		super(props);
	}

	// Метод открытия чата при клике на chatPreview
	public openChat(chat: Chat, preview:HTMLElement): void {
		// Сначал убираем active у текущего нажатого превью
		Array.from(this.subElements('button.chatPreview.active')).forEach(el => {
			el.classList.remove('active');
		});
		preview.classList.add('active');
		if(this.props.chatFeed instanceof ChatFeed){
			this.props.chatFeed.attachChat(chat);
		}else{
			console.error('Не указан chatFeed для chatlist');
		}
	}

	protected override render(data: chatlistData): HTMLElement {
		return chatlist(data, this.openChat.bind(this));
	}

	protected override update(): void {
		return;
	}
}
