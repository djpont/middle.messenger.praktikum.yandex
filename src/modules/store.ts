import {EventBus} from "~src/modules/event-bus";
import BaseComponent, {ComponentPropsData} from "~src/components/components";
// import {isEqual} from "~src/modules/functions";

const StoreEVENTS = {
	updated: 'updated',
} as const;

export type Indexed = Record<string, unknown>;

export type storeUserType = {
	id: number,
	email: string,
	login: string,
	first_name: string,
	second_name: string,
	phone: string,
	display_name: string,
	avatar: string,
	avatarText: string
}

type storeChatType = {
	id: number,
	title: string,
	avatar: string
}

export type storeDataType = {
	currentUser?: storeUserType,
	foundUsers?: Indexed,
	chats?: {[key: number]: storeChatType},
	currentChatUsers?: Indexed,
	currentChatId?: number
} & Indexed;

type connectMappingType = (store: storeDataType) => Indexed;

export function connect<T>(Component: T, mapping: connectMappingType): T {
	return class extends (Component as typeof BaseComponent) {
		constructor(props: ComponentPropsData = {}) {
			merge(props, mapping(store.getState()));
			super(props);
			store.on(StoreEVENTS.updated, () => {
				merge(this.props, mapping(store.getState()));
			});
		}
	} as T;
}

class Store extends EventBus {
	protected _state: storeDataType = {};

	constructor() {
		super();
		this.on(StoreEVENTS.updated, () => {
			// console.log('Store updated', this._state);
		})
	}

	public getState(): storeDataType {
		return this._state;
	}

	public set(path: string, value: unknown): void {
		set(this._state, path, value);
		this.emit(StoreEVENTS.updated);
	}

	public unset(path: string, emit: boolean = true): void {
		unset(this._state, path);
		if (emit) {
			this.emit(StoreEVENTS.updated);
		}
	}

	public reset(): void {
		this.unset('', false);
		this._state = {};
		this.emit(StoreEVENTS.updated);
	}
}

const store: Store = new Store();
export {store};

function set(object: Indexed, path: string, value: unknown): Indexed {
	const object2: Indexed = {};
	const pathArray = path.split('.');
	pathArray.reduce((obj, key, index) => {
		if (index === pathArray.length - 1) {
			if (obj[key] === undefined) {
				obj[key] = {};
			}
			obj[key] = value;
		} else {
			obj[key] = {};
		}
		return obj[key];
	}, object2);
	object = merge(object, object2);
	return object;
}

function unset(object: Indexed, path: string): Indexed {
	const pathArray = path.split('.');
	pathArray.reduce((obj, key, index) => {
		if (index === pathArray.length - 1) {
			obj[key] = {};
		}
		return obj[key];
	}, object);
	return object;
}

function merge(object1: Indexed, object2: Indexed): Indexed {
	let result = object1;
	if (object2 !== null && object2 !== undefined) {
		if (Object.keys(object2).length === 0) {
			result = {};
		}
	}
	for (const key in object2) {
		if (result[key] === undefined) {
			result[key] = {};
		}
		if (typeof object2[key] === "object") {
			result[key] = merge(result[key] as Indexed, object2[key] as Indexed);
		} else {
			result[key] = object2[key];
		}
	}
	return result;
}
