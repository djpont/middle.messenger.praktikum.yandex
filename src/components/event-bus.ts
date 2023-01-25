
import {Fn} from "~src/functions";

export class EventBus {
	private readonly _listeners: Record<string, Fn<unknown>[]>;

	constructor() {
		this._listeners = {};
	}

	on(event: string, callback: Fn<unknown>) {
		if (this._listeners[event]===undefined) {
			this._listeners[event] = [];
		}
		this._listeners[event].push(callback);
	}

	off(event: string, callback: Fn<unknown>) {
		if (this._listeners[event] === undefined) {
			this.error(event);
		}
		this._listeners[event] = this._listeners[event].filter(
			listener => listener !== callback
		);
	}

	emit(event: string, ...args: unknown[]) {
		if (this._listeners[event] === undefined) {
			this.error(event);
		}else{
			this._listeners[event].forEach(
				listener => listener(...args)
			);
		}
	}

	error(event: string) {
		// throw new Error(`Нет события: ${event}`);
		console.error(`Нет события: ${event}`);
	}
}
