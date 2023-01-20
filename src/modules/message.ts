import Chat from "~src/modules/chat";
import User from "~src/modules/user";

export enum messageStatus {
    read = 'read',
    unread = 'unread'
}

export type messageData = {
    id: string,
    chat?: Chat,
    user: User,
    datetime: string,
    time?:string
    text: string,
    status?: messageStatus,
}

export default class Message {
    private _id: string;
    private _chat: Chat;
    private _user: User;
    private _datetime: string;
    private _text: string;
    private _status: messageStatus;

    private static _messages: Message[] = [];

    constructor(data: messageData) {
        const {id,
            chat,
            user,
            datetime,
            text,
            status = messageStatus.unread
        } = data;
        this._id = id;
        this._chat = chat
        this._user = user;
        this._datetime = datetime;
        this._text = text;
        this._status = status;
        Message._messages.push(this);
    }

    data = (): messageData => {
        return {
            id: this._id,
            chat: this._chat,
            user: this._user,
            datetime: this._datetime,
            time: new Date(this._datetime).toTimeString().slice(0, 5),
            text: this._text,
            status: this._status
        }
    }

    static getMessagesByUser = (user: User): Message[] => {
        return Message._messages.filter((message: Message) => message._user === user);
    }


}
