
export const messageStatuses = Object.freeze({
	read:'read',
	unread:'unread'
});

export default class Message{
	#id;
	#chat;
	#user;
	#datetime;
	#text;
	#status;
	
	static #messages = [];
	constructor(id, chat, user, datetime, text, status=messageStatuses.unread) {
		this.#id=id;
		this.#chat=chat
		this.#user=user;
		this.#datetime=datetime;
		this.#text=text;
		this.#status=status;
		Message.#messages.push(this);
	}
	
	data = () => {
		return {
			id:this.#id,
			user:this.#user,
			datetime:this.#datetime,
			time:new Date(this.#datetime).toTimeString().slice(0,5),
			text:this.#text
		}
	}
	
	static getMessagesByUser = (user) => Message.#messages.filter((message) => message.#user===user);
	
	
}