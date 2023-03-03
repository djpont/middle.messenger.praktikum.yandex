import Profile from "./profile";
import {connect, Indexed, storeDataType} from "../../modules/store";

const profileConnected = connect<typeof Profile>(Profile, mapping);

function mapping(state: storeDataType): Indexed {
	return state.currentUser as Indexed;
}

export default profileConnected;
