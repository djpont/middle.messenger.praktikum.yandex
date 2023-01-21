import tpl_chatfeed from './tpl_chatfeed.hbs';
import tpl_message from './tpl_message.hbs';
import './style.scss';

import {Component, generateDom} from "~src/components/components";
import Chat from "~src/modules/chat";
import User from "~src/modules/user";
import {messageData} from "~src/modules/message";

export const message = (data: messageData): string => {
	const {//id,
		//chat,
		user,
		time,
		text,
		//status
	} = data;
	const nickname: string = user.data().nickname;
	const className: string = (user === User.getMyUser()) ? 'out' : 'in';
	return tpl_message({nickname, text, time, className});
};

export default class ChatFeed extends Component {
	private _chat: Chat | boolean;

	constructor() {
		const document: HTMLElement = generateDom(tpl_chatfeed());
		super(document, `.feed`);
		this._chat = false;
	}

	attachChat = (chat: Chat): void => {
		this.document().classList.remove('hidden');
		this._chat = chat;
		const data = chat.data();
		this.clearMessages();
		this.subElement('.header .avatar').style.backgroundImage = `url('${data.avatar}')`;
		this.subElement('.header .chatName').innerText = data.title;
		(this.subElement('.newMessage .text') as HTMLInputElement).value = '';
		this.fillMessages();
	}

	clearMessages() {
		this.element().innerHTML = '';
	}

	fillMessages() {
		if (this._chat instanceof Chat) {
			this._chat.data().messages.forEach(msg => {
				const messageHtml = message(msg.data());
				this.element().append(generateDom(messageHtml));
			})
		}
	}
}
