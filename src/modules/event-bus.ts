import {Fn} from "~src/modules/functions"; // Тип функции

export class EventBus {
	private readonly _listeners: Record<string, Fn<unknown>[]>;

	constructor() {
		this._listeners = {};
	}

	// Метод добавляения событий в EventBus
	on(event: string, callback: Fn<unknown>, insertBeforeLastListener: boolean = false) {
		if (this._listeners[event] === undefined) {
			this._listeners[event] = [];
		}
		if (!this._listeners[event].includes(callback)) {
			if (insertBeforeLastListener && this._listeners[event].length > 0) {
				this._listeners[event].splice(this._listeners[event].length - 1, 0, callback);
			} else {
				this._listeners[event].push(callback);
			}
		}
	}

	// Метод удаления событий из EventBus
	off(event: string, callback: Fn<unknown>) {
		if (this._listeners[event] === undefined) {
			this.error(event);
		}
		this._listeners[event] = this._listeners[event].filter(
			listener => listener !== callback
		);
	}

	// Метод вызова цепочки событий из EventBus
	emit(event: string, ...args: unknown[]) {
		if (this._listeners[event] === undefined) {
			this.error(event);
		} else {
			this._listeners[event].forEach(
				listener => {
					listener(...args);
				}
			);
		}
	}

	// Метод в случае ошибки
	error(event: string) {
		console.error(`Нет события: ${event}`);
	}
}
