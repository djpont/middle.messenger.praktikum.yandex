import tpl_chatlist from './tpl_chatlist.hbs';
import tpl_chat_preview from './tpl_chat_preview.hbs';
import './style.scss';
import {Component, generateDom} from "~src/components/components";
import Chat from "~src/modules/chat";
import Message, {messageData} from "~src/modules/message";
import ChatFeed from "~src/components/chat-feed";

type chatPreviewData = {
    name: string,
    time: string,
    avatar: string,
    text: string,
    unreadCount: number
}

export const chat_preview = (data: chatPreviewData): string => {
    const {
        name,
        time,
        avatar,
        text,
        unreadCount
    } = data;
    return tpl_chat_preview(data);
};

class Preview extends Component {
    private _chat;

    constructor(chat: Chat) {
        const lastMessage: messageData = chat.getLastMessage().data();
        const unreadCount = 1;
        const data: chatPreviewData = {
            name: chat.data().title,
            avatar: chat.data().avatar,
            text: lastMessage.text,
            time: new Date(lastMessage.datetime).toTimeString().slice(0, 5),
            unreadCount
        };
        const document: HTMLElement = generateDom(chat_preview(data));
        super(document, `*`);
        this._chat = chat;
    }

    getChat = (): Chat => {
        return this._chat;
    }

    makeSelected = (): void => {
        this.document().classList.add('active');
    }
    makeUnselected = (): void => {
        this.document().classList.remove('active');
    }
}

export default class Chatlist extends Component {
    private _previews: Preview[];
    private _attachedFeed: ChatFeed | boolean;

    constructor() {
        const data = {};
        const document = generateDom(tpl_chatlist(data));
        super(document, `.chatlist`);
        this._attachedFeed = false;
        this._previews = [];
    }

    addChat = (chat: Chat): void => {
        const preview = new Preview(chat);
        this._previews.push(preview);
        this.document().append(preview.document());
        preview.document().addEventListener('click', () => {
            this.openChat(chat);
        });
    }

    attachFeed = (chatFeed: ChatFeed) => {
        this._attachedFeed = chatFeed;
    }

    openChat = (chat: Chat) => {
        if (this._attachedFeed instanceof ChatFeed) {
            this._attachedFeed.attachChat(chat);
            this._previews.forEach((preview) => {
                if (preview.getChat() === chat) {
                    preview.makeSelected();
                } else {
                    preview.makeUnselected();
                }
            });
        } else {
            console.error('Нет привязанного окна')
        }
    }
}
