import Message from "./message";

export type userData = {
    id: string,
    login: string,
    avatar: string,
    nickname?: string
}

export default class User {
    private _id: string;
    private _login: string;
    private _avatar: string;
    private _nickname: string;

    private static _users: User[] = [];
    private static _myUser: User;

    constructor(data: userData) {
        this._id = data.id;
        this._login = data.login;
        this._nickname = `${data.login.charAt(0).toUpperCase()}${data.login.substr(1).toLowerCase()}`;
        this._avatar = data.avatar;
        User._users.push(this);
    }

    data = (): userData => {
        return {
            id: this._id,
            login: this._login,
            nickname: this._nickname,
            avatar: this._avatar
        }
    }

    static setMyUser(user: User): void {
        this._myUser = user;
    }

    static getMyUser = (): User => this._myUser;

    static getUserById = (id: string): User => User._users.find((user: User) => user._id === id);
    static getUserByLogin = (login: string) => User._users.find((user: User) => user._login.toLowerCase() === login.toLowerCase());

    static getUsersList = (): User[] => User._users;

    getMessages = (): Message[] => Message.getMessagesByUser(this);

}
