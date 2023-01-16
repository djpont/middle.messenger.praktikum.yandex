import tpl_chatfeed from './tpl_chatfeed.hbs';
import tpl_message from './tpl_message.hbs';
import './style.css';
import {Component, generateDom} from "../components";
import Chat from "/src/modules/chat";
import User from "/src/modules/user";

export const message = ({nickname, time, text, className}) => {
	return tpl_message({nickname, text, time, className});
};

export default class ChatFeed extends Component {
	#chat;
	
	constructor(chat = {}) {
		const data = {};
		if (chat instanceof Chat) {
			data.chatName = chat.data().title;
			data.avatar = chat.data().avatar;
		}
		const document = generateDom(tpl_chatfeed(data));
		super(document, `.feed`);
		this.#chat = false;
	}
	
	attachChat = (chat) => {
		this.document().classList.remove('hidden');
		this.#chat = chat;
		const data = chat.data();
		this.clearMessages();
		this.subElement('.header .avatar').style.backgroundImage = `url('${data.avatar}')`;
		this.subElement('.header .chatName').innerText = data.title;
		this.subElement('.newMessage .text').value = '';
		this.fillMessages();
	}
	
	clearMessages(){
		this.element().innerHTML='';
	}
	
	fillMessages() {
		this.#chat.data().messages.forEach(msg => {
			const nickname = msg.data().user.data().nickname;
			const classname = (msg.data().user === User.getMyUser()) ? 'out' : 'in';
			const messageHtml = message({
				nickname:nickname,
				text:msg.data().text,
				time:msg.data().time,
				className: classname});
			this.element().append(generateDom(messageHtml));
		})
	}
	
}