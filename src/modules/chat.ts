import Message from "./message";


export default class Chat {
	#id;
	#title;
	#avatar;
	#users;
	#messages;

	static #chats = [];

	constructor(id, title, avatar = '', users = [], messages = []) {
		this.#users = [];
		this.#messages = [];
		this.#id = id;
		this.#title = title;
		if (avatar) {
			this.#avatar = avatar;
		} else {
			this.#avatar = '';
		}
		if (users.length > 0) {
			for (const user of users) {
				this.#users.push(user);
			}
		}
		Chat.#chats.push(this);
	}

	data = () => {
		return {
			id: this.#id,
			title: this.#title,
			avatar: this.#avatar,
			users: this.#users,
			messages: this.#messages
		}
	}

	addUser = (user) => Chat.#chats.push(user);

	static getChatById = (id) => Chat.#chats.find((chat) => chat.#id === id);

	static getChatsList = () => Chat.#chats;

	addMessage = (id, user, datetime, text, status) => {
		if (this.#users.includes(user)) {
			this.#messages.push(new Message(id, this, user, datetime, text, status));
		} else {
			console.error(`User отсутствует в чате`,);
		}
	}

	getLastMessage = () => {
		return this.#messages[this.#messages.length-1];
	}
}
