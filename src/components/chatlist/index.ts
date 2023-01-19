import tpl_chatlist from './tpl_chatlist.hbs';
import tpl_chat_preview from './tpl_chat_preview.hbs';
import './style.scss';
import {Component, generateDom} from "~src/components/components";

export const chat_preview = (name, time, avatar, text='', unreadCount = 0) => {
	const data = {name, time, avatar, text, unreadCount};
	return tpl_chat_preview(data);
};

class Preview extends Component {
	#chat;
	
	constructor(chat) {
		const avatar=chat.data().avatar;
		const name=chat.data().title;
		const lastMessage=chat.getLastMessage().data();
		const lastMessageText=lastMessage.text;
		const lastMessageTime=new Date(lastMessage.datetime).toTimeString().slice(0, 5);
		const unreadCount=1;
		const document = generateDom(chat_preview(name, lastMessageTime,avatar, lastMessageText, unreadCount));
		super(document, `*`);
		this.#chat = chat;
	}
	
	getChat = () => {
		return this.#chat;
	}
	
	makeSelected = () => {
		this.document().classList.add('active');
	}
	makeUnselected = () => {
		this.document().classList.remove('active');
	}
}

export default class Chatlist extends Component {
	#previews;
	#attachedFeed;
	
	constructor() {
		const data = {};
		const document = generateDom(tpl_chatlist(data));
		super(document, `.chatlist`);
		this.#previews = [];
	}
	
	addChat = (chat) => {
		const preview = new Preview(chat);
		this.#previews.push(preview);
		this.document().append(preview.document());
		preview.document().addEventListener('click', () => {
			this.openChat(chat);
		});
	}
	
	attachFeed = (chatFeed) => {
		this.#attachedFeed=chatFeed;
	}
	
	openChat = (chat) => {
		if(this.#attachedFeed){
			this.#attachedFeed.attachChat(chat);
			this.#previews.forEach((preview) => {
				if(preview.getChat()===chat){
					preview.makeSelected();
				}else{
					preview.makeUnselected();
				}
			});
		}else{
			console.error('Нет привязанного окна')
		}
	}
}
