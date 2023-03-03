import Options from "./options";
import {connect, Indexed, storeDataType} from "../../modules/store";

const optionsConnected = connect<typeof Options>(Options, mapping);

function mapping(state: storeDataType): Indexed {
	const chat = Object.values(state.chats ?? {}).find(c => {
		return c.id === state.currentChatId
	})
	return {
		chat: chat ?? {}
	};
}

export default optionsConnected;
