import Message, {messageData} from "./message";
import User from "~src/modules/user";

// Модуль Чат. Хранит в себе данные чата и сообщения из этого чата
// В будущем будет адапритован для работы с API Практики

export type chatData = {
	id: string,
	title: string,
	avatar: string,
	users: User[],
	messages: Message[]
}

export default class Chat {
	private readonly _id: string;
	private readonly _title: string;
	private readonly _avatar: string;
	private readonly _users: User[];
	private readonly _messages: Message[];

	// Список всех экземпляров класса Чат
	private static chats: Chat[] = [];

	constructor(data: chatData) {
		const {
			id,
			title,
			avatar = '',
			users = [],
			// messages=[]
		} = data;
		this._users = [];
		this._messages = [];
		this._id = id;
		this._title = title;
		this._avatar = avatar;
		if (users.length > 0) {
			for (const user of users) {
				this._users.push(user);
			}
		}
		Chat.chats.push(this);
	}

	public data(): chatData {
		return {
			id: this._id,
			title: this._title,
			avatar: this._avatar,
			users: this._users,
			messages: this._messages
		};
	}

	// addUser = (user: User): number => this.users.push(user);

	public static getChatById(id: string): Chat {
		const chat = Chat.chats.find((chat: Chat) => chat.data().id === id);
		if (chat === undefined) {
			throw new Error(`Чат ${id} не найден`);
		}
		return chat;
	}

	public static getChatsList(): Chat[] {
		return Chat.chats;
	}

	public addMessage(data: messageData): void {
		if (this._users.includes(data.user)) {
			if (!data.chat) {
				data.chat = this;
			}
			this._messages.push(new Message(data));
		} else {
			console.error(`User отсутствует в чате`,);
		}
	}

	public getLastMessage(): Message {
		if(this._messages.length===0){
			console.error(this);
			console.error('Список в чате сообщений пуст');
		}
		return this._messages[this._messages.length - 1];
	}
}
