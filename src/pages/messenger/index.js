import tpl_messenger from './tpl_messenger.hbs';
import Chat from "/src/modules/chat";
import './style.css';

import {generateDom} from "../../components/components";

import Window from "../../components/window";
import ChatFeed from "/src/components/chat-feed";
import ChatList from "/src/components/chatlist";
import User from "/src/modules/user";

export default (rootElement) => {
	
	// Генерируем окно
	const page = new Window(
		'messenger',
		'messenger',
		'WinChat 98 - Электронные диалоги',
		{
			close:true
		}
	);
	rootElement.append(page.document());
	
	// Генерируем содержимое окна по шаблону
	const document=generateDom(tpl_messenger({
		profile: User.getMyUser().data()
	}));
	page.content().append(document);
	
	// Создаём экземпляр списка чатов и прииваиваем ему дом элемент для отображения чата
	const chatList = new ChatList();
	page.subElement('fieldset.chatsListField div.container').append(chatList.document());
	Chat.getChatsList().forEach(chat => chatList.addChat(chat));
	
	// Создаём экземпляк ленты сообщений
	const chatFeed = new ChatFeed();
	page.subElement('div.chatFeedHolder').append(chatFeed.document());
	
	// Дружим список чатов и ленту сообщений
	chatList.attachFeed(chatFeed);
	
	// Открываем первый чат в ленте сообщений
	if(Chat.getChatsList().length>0){
		chatList.openChat(Chat.getChatsList()[0]);
	}
	
}