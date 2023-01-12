import Window from "/src/components/window";
import ChatFeed from "/src/components/chat-feed";
import Chat from "/src/modules/chat";

export default (rootElement) => {
	const page = new Window(
		'chat-feed',
		'',
		'Лента сообщений'
	);
	
	const chatfeed = new ChatFeed();
	
	page.content().append(chatfeed);
	
	rootElement.append(page.document());
	return {
		window:page,
		chatfeed:chatfeed
	}
}