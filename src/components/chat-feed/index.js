import Handlebars from 'handlebars';
//import Handlebars from 'handlebars/dist/handlebars.runtime';
import tpl from './tpl.hbs';
import tpl_message from './tpl_message.hbs';
import './style.css';
import {Component, generateDom} from "../components";
import Chat from "/src/modules/chat";
import User from "/src/modules/user";
// import Message from "../../modules/message";

Handlebars.registerPartial('message', tpl);

export const message = (text, time, className) => {
	return tpl_message({text, time, className});
};

export default class ChatFeed extends Component {
	#chat;
	
	constructor(chat = {}) {
		const data = {};
		if (chat instanceof Chat) {
			data.chatName = chat.data().title;
			data.avatar = chat.data().avatar;
		}
		const document = generateDom(tpl(data));
		super(document, `.feed`);
		this.#chat = false;
	}
	
	attachChat = (chat) => {
		this.#chat = chat;
		const data = chat.data();
		this.subElement('.header .avatar').innerText = data.avatar;
		this.subElement('.header .chatName').innerText = data.title;
		this.subElement('.newMessage .text').value = '';
		this.fillMessages(0);
	}
	
	fillMessages(fromDateTime = 0) {
		this.#chat.data().messages.forEach(msg => {
			const unixTime = new Date(msg.data().datetime).getTime();
			if (unixTime > fromDateTime) {
				let classname;
				classname = (msg.data().user === User.getMyUser()) ? 'out' : 'in';
				const messageHtml = message(msg.data().text, msg.data().time, classname);
				this.element().append(generateDom(messageHtml));
			}
		})
	}
	
}