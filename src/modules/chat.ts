import Message, {messageStatus, messageData} from "./message";
import User from "~src/modules/user";

export type chatData = {
	id: string,
	title: string,
	avatar?: string,
	users?: User[],
	messages?: Message[]
}

export default class Chat {
	private _id: string;
	private _title: string;
	private _avatar: string;
	private _users: User[];
	private _messages: Message[];

	private static chats: Chat[] = [];

	constructor(data: chatData) {
		const {
			id,
			title,
			avatar='',
			users=[],
			messages=[]
		} = data;
		this._users = [];
		this._messages = [];
		this._id = id;
		this._title = title;
		this._avatar=avatar;
		if (users.length > 0) {
			for (const user of users) {
				this._users.push(user);
			}
		}
		Chat.chats.push(this);
	}

	data = (): chatData => {
		return {
			id: this._id,
			title: this._title,
			avatar: this._avatar,
			users: this._users,
			messages: this._messages
		};
	}

	// addUser = (user: User): number => this.users.push(user);

	static getChatById = (id: string): Chat => Chat.chats.find((chat: Chat) => chat.data().id === id);

	static getChatsList = (): Chat[] => Chat.chats;

	addMessage = (data: messageData): void => {
		if (this._users.includes(data.user)) {
			if(!data.chat){
				data.chat=this;
			}
			this._messages.push(new Message(data));
		} else {
			console.error(`User отсутствует в чате`,);
		}
	}

	getLastMessage = (): Message => {
		return this._messages[this._messages.length-1];
	}
}
