import Messenger from "~src/pages/messenger/messenger";
import {connect, Indexed, storeDataType} from "~src/modules/store";

const MessengerConnected = connect<typeof Messenger>(Messenger, mapping);

function mapping(state: storeDataType): Indexed {
	return {
		avatar: state.currentUser?.avatar,
		avatarText: state.currentUser?.avatarText,
		display_name: state.currentUser?.display_name,
	} as Indexed;
}

export default MessengerConnected;
