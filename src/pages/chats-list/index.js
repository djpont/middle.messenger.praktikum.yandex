// import {joinDom} from '/src/functions';
import Window from "/src/components/window";
import Chatlist from "/src/components/chatlist";
import Button from '/src/components/button';
import Input from "../../components/input";
import Field from "/src/components/field";
import Chat from "/src/modules/chat";


export default (rootElement) => {
	const page = new Window(
		'chat-list',
		'',
		'Список чатов'
	);
	
	const searchField = new Input('search', 'search', 'Поиск:');
	const searchButton = new Button('search_button', 'Найти');
	const profileButton = new Button('profile_button', 'Профиль');
	
	const search = new Field([searchField, searchButton], 'search');
	const headerBLock = new Field([search, profileButton], 'header_block');
	
	const chatlist = new Chatlist();
	
	page.content().append(headerBLock, chatlist);
	rootElement.append(page.document());
	
	Chat.getChatsList().forEach(chat => chatlist.addChat(chat));
	return {
		window:page,
		chatlist:chatlist
	}
}