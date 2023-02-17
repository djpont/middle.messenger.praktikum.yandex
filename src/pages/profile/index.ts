import Profile from "~src/pages/profile/profile";
import {connect, Indexed, storeDataType} from "~src/modules/store";

const profileConnected = connect<typeof Profile>(Profile, mapping);

function mapping(state: storeDataType): Indexed {
	return state.currentUser as Indexed;
}

export default profileConnected;
