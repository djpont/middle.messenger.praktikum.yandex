import Chatlist from "./chatlist";
import {connect, Indexed, storeDataType} from "../../modules/store";

const ChatlistConnected = connect<typeof Chatlist>(Chatlist, mapping);

function mapping(state: storeDataType): Indexed {
	return {
		chats: state.chats ?? {}
	} as Indexed;
}

export default ChatlistConnected;
