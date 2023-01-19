import Message from "./message";

export default class User {
	#id;
	#login;
	#avatar;
	#nickname;
	
	// noinspection JSMismatchedCollectionQueryUpdate
	static #users=[];
	static #myUser;
	
	constructor(id, login, avatar='') {
		this.#id=id;
		this.#login=login;
		this.#nickname=`${login.charAt(0).toUpperCase()}${login.substr(1).toLowerCase()}`;
		this.#avatar=avatar;
		User.#users.push(this);
	}
	
	data = () => {
		return {
			id:this.#id,
			login:this.#login,
			nickname:this.#nickname,
			avatar:this.#avatar
		}
	}

	static setMyUser(user){
		this.#myUser=user;
	}
	
	static getMyUser = () => this.#myUser;
	
	static getUserById = (id) => User.#users.find((user) => user.#id===id);
	static getUserByLogin = (login) => User.#users.find((user) => user.#login.toLowerCase()===login.toLowerCase());
	
	static getUsersList = () => User.#users;
	
	getMessages = () => Message.getMessagesByUser(this);
	
}
