import Handlebars from 'handlebars';
//import Handlebars from 'handlebars/dist/handlebars.runtime';
import tpl from './tpl.hbs';
import tpl_chat_preview from './tpl_chat_preview.hbs';
import './style.css';
import {Component, generateDom} from "../components";
// import Chat from "/src/modules/chat";
// import ChatFeed from '/src/components/chat-feed';

Handlebars.registerPartial('chat_preview', tpl_chat_preview);

export const chat_preview = (name, time, text='rtrt', unreadCount = 0) => {
	const data = {name, time, text, unreadCount};
	return tpl_chat_preview(data);
};

class Preview extends Component {
	#chat;
	
	constructor(chat) {
		const lastMessage=chat.getLastMessage().data();
		const chatName=chat.data().title;
		const lastMessageText=chat.getLastMessage().data().text;
		const lastMessageTime=new Date(chat.getLastMessage().data().datetime).toTimeString().slice(0, 5);
		const unreadCount=1;
		const document = generateDom(chat_preview(chatName, lastMessageTime,lastMessageText, unreadCount));
		super(document, `*`);
		this.#chat = chat;
	}
}

export default class Chatlist extends Component {
	#previews;
	#attachedFeed;
	
	constructor() {
		const data = {};
		const document = generateDom(tpl(data));
		super(document, `.chatlist`);
		this.#previews = [];
	}
	
	addChat = (chat) => {
		const preview = new Preview(chat);
		this.#previews.push(preview);
		this.document().append(preview.document());
	}
	
	attachFeedWindow = (chatFeed) => {
		this.#attachedFeed=chatFeed;
	}
	
	openChat = (chat) => {
		if(this.#attachedFeed){
			this.#attachedFeed.attachChat(chat);
		}else{
			console.error('Нет привязанного окна')
		}
	}
}