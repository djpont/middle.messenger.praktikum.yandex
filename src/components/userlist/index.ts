import Userlist from "./userlist";
import {connect, Indexed, storeDataType} from "../../modules/store";

const UserlistSearchConnected = connect<typeof Userlist>(Userlist, mappingFound);

function mappingFound(state: storeDataType): Indexed {
	const currentChatUsers: Indexed = state.currentChatUsers ?? {};
	const currentChatUsersArray: number[] = [];
	const foundUsers = state.foundUsers ?? {};

	// Собираем id пользователей из открытого чата в массив
	Object.values(currentChatUsers).forEach(u => {
		currentChatUsersArray.push((u as object)['id']);
	});

	// Фильтруем их из списка найденных пользователей
	const foundUsersFiltered = Object.values(foundUsers).filter(u => {
		return !(currentChatUsersArray.includes((u as object)['id']));
	});

	return {
		users: foundUsersFiltered
	} as Indexed;
}

const UserlistCurrentChatConnected = connect<typeof Userlist>(Userlist, mappingCurrentChatUsers);

function mappingCurrentChatUsers(state: storeDataType): Indexed {
	const myUser: Indexed = state.currentUser ?? {};
	const currentChatUsers: Indexed = state.currentChatUsers ?? {};

	// Фильтруем себя
	const currentChatUsersFiltered = Object.values(currentChatUsers).filter((u: Indexed) => {
		return u.id!==myUser.id;
	});

	return {
		users: currentChatUsersFiltered
	} as Indexed;
}

export {UserlistSearchConnected, UserlistCurrentChatConnected};
