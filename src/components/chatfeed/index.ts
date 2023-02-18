import ChatFeed from "~src/components/chatfeed/chatfeed";
import {connect, Indexed, storeDataType} from "~src/modules/store";

const ChatFeedConnected = connect<typeof ChatFeed>(ChatFeed, mapping);

function mapping(state: storeDataType): Indexed {
	let chat=undefined;
	if(state.chats){
		chat = Object.values(state.chats as object).find(ch => {
			return ch.id === state.currentChatId
		});
	}
	if(chat===undefined){
		chat={};
	}

	let messages = state.messages ?? {};
	const users = state.currentChatUsers ?? {};
	const myUser = state.currentUser;

	messages = Object.values(messages)
		.sort((a, b) => {
		const timeA = new Date(a.time);
		const timeB = new Date(b.time);
		return timeA.getTime() - timeB.getTime();
	});

	Object.values(messages).forEach(msg => {
		if(msg['user_id']){
			if(msg['user_id']===myUser?.id){
				msg['way']='out';
				msg['displayName']=myUser?.display_name;
			}else{
				const user = Object.values(users).find((u: object) => {
					return u['id']===msg['user_id'];
				}) as object;
				msg['way']='in';
				msg['displayName']=user['display_name'];
			}
		}
		if(msg['time'] && !msg['timeShort']){
			const date = new Date(msg['time']);
			msg['timeShort'] = date.toLocaleTimeString();
			msg['dateShort'] = date.toDateString();
		}
	});

	return {
		chat,
		messages
	} as Indexed;
}

export default ChatFeedConnected;
