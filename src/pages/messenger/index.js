import Chat from "/src/modules/chat";

import page_chat_list from '/src/pages/chats-list';
import page_chat_feed from '/src/pages/chat-feed';

export default (rootElement) => {
	const window_ChatList = page_chat_list(rootElement);
	const window_ChatFeed = page_chat_feed(rootElement);
	
	window_ChatList.chatlist.attachFeedWindow(window_ChatFeed.chatfeed);
	
	window_ChatList.chatlist.openChat(Chat.getChatsList()[0]);
}