import Options from "~src/pages/options/options";
import {connect, Indexed, storeDataType} from "~src/modules/store";

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
