import Fetch from "~src/modules/fetch";
import Alert from "~src/components/window/alert";
import {store} from "~src/modules/store";

// Модуль Авторизации.

type apiType = Record<string, string>;

export default class Api {

	private static _socket: WebSocket;
	private static _socketPingInterval: number;

	// Префикс для аватарок
	private static _avatarUrlPrefix = 'https://ya-praktikum.tech/api/v2/resources';

	// Регистрация
	public static signUp(data: apiType): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			Fetch.post({path: '/auth/signup', data})
				.then(res => Api.handleResponse(res as XMLHttpRequest))
				.then(res => {
					if (res.status) {
						store.reset();
						Api.isAuthorized()
							.then(() => resolve(res.response))
							.catch(error => {
								Api.catchError(error)
							});
					} else {
						reject(res.response);
					}
				})
				.catch(error => {
					Api.catchError(error)
				});
		});
	}

	// Авторизация
	public static signIn(data: apiType): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			Fetch.post({path: '/auth/signin', data})
				.then(res => Api.handleResponse(res as XMLHttpRequest))
				.then(res => {
					if (res.status && res.response.text === 'OK') {
						resolve(res.response);
						Api.getChats({});
					} else {
						reject(res.response);
					}
				})
				.catch(error => {
					Api.catchError(error)
				});
		});
	}

	// Выход
	public static logout(): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			Api.closeChat();
			Fetch.post({path: '/auth/logout'})
				.then(res => Api.handleResponse(res as XMLHttpRequest))
				.then(res => {
					if (res.status) {
						store.reset();
						resolve(res.response);
					} else {
						reject(res.response);
					}
				})
				.catch(error => {
					Api.catchError(error);
				});
		});
	}

	// Получение данных о текущем пользователе
	public static getMyUserInfo(): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			Fetch.get({path: '/auth/user'})
				.then(res => Api.handleResponse(res as XMLHttpRequest))
				.then(res => {
					if (res.status) {
						if (!res.response.display_name) {
							res.response.display_name = res.response.login;
						}
						if (res.response.avatar) {
							res.response.avatar =
								`${Api._avatarUrlPrefix}${res.response.avatar}`;
						} else {
							res.response.avatarText
								= (res.response.display_name as string).charAt(0).toUpperCase();
						}
						store.set('currentUser', res.response);
						resolve(res.response);
					} else {
						store.reset();
						store.set('currentUser', {id: 0});
						reject(res.response);
					}
				})
				.catch(error => {
					Api.catchError(error)
				});
		});
	}

	// Проверка есть ли пользователь в store
	public static isAuthorized(): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			const currentUser = store.getState().currentUser;
			if (currentUser) {
				if (currentUser?.id > 0) {
					resolve(currentUser);
				} else {
					reject(currentUser);
				}
			} else {
				Api.getMyUserInfo()
					.then(res => {
						resolve(res);
						Api.getChats({});
					})
					.catch(res => reject(res));
			}
		});


	}

	// Изменение данных пользователя
	public static editProfile(data: apiType): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			Fetch.put({path: '/user/profile', data})
				.then(res => Api.handleResponse(res as XMLHttpRequest))
				.then(res => {
					if (res.status) {
						Api.getMyUserInfo()
							.then(() => resolve(res.response));
					} else {
						reject(res.response);
					}
				})
				.catch(error => {
					Api.catchError(error)
				});
		});
	}

	// Изменение данных пользователя
	public static editAvatar(file: File): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			const data = new FormData();
			data.append('avatar', file);
			Fetch.put({path: '/user/profile/avatar', data})
				.then(res => Api.handleResponse(res as XMLHttpRequest))
				.then(res => {
					if (res.status) {
						res.response.avatarText = '';
						res.response.avatar =
							`${Api._avatarUrlPrefix}/${res.response.avatar}`;
						store.set('currentUser', res.response);
						resolve(res.response);
					} else {
						reject(res.response);
					}
				})
				.catch(error => {
					Api.catchError(error)
				});
		});
	}

	// Изменение пароля
	public static changePassword(data: apiType): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			Fetch.put({path: '/user/password', data})
				.then(res => Api.handleResponse(res as XMLHttpRequest))
				.then(res => {
					(res.status && res.response.text === 'OK')
						? resolve(res.response)
						: reject(res.response);
				})
				.catch(error => {
					Api.catchError(error)
				});
		});
	}

	// Получаем список чатов
	public static getChats(data: apiType): void {
		Fetch.get({path: '/chats', data})
			.then(res => Api.handleResponse(res as XMLHttpRequest))
			.then(res => {
				store.unset('chats');
				Object.values(res.response as object).forEach(chat => {
					if (chat.avatar) {
						chat.avatar = `${Api._avatarUrlPrefix}${chat.avatar}`;
					} else {
						chat.avatarText = chat.title.charAt(0).toUpperCase();
					}
				});
				store.set('chats', res.response);
			})
			.catch(error => {
				Api.catchError(error)
			});
	}

	// Поиск пользователя
	public static findUser(data: apiType): Promise<Record<string, unknown> | unknown[]> {
		return new Promise((resolve, reject) => {
			Fetch.post({path: '/user/search', data})
				.then(res => Api.handleResponse(res as XMLHttpRequest))
				.then(res => {
					if (res.status) {
						Api.clearFoundUsers();
						if (Object.keys(res.response as object).length > 0) {
							Object.values(res.response as object).forEach(user => {
								if (!user.display_name) {
									user.display_name = user.login;
								}
								if (user.avatar) {
									user.avatar =
										`${Api._avatarUrlPrefix}${user.avatar}`;
								} else {
									user.avatarText
										= (user.display_name as string).charAt(0).toUpperCase();
								}
							});
							store.set('foundUsers', res.response);
						}
						resolve(res.response);
					} else {
						reject(res.response);
					}
				})
				.catch(error => {
					Api.catchError(error)
				});
		});
	}

	// Очистка списка найденных пользователей
	public static clearFoundUsers(): void {
		store.unset('foundUsers');
	}

	// Новый чат
	public static createChat(title: string): Promise<Record<string, unknown> | unknown[]> {
		return new Promise((resolve, reject) => {
			Fetch.post({path: '/chats', data: {title}})
				.then(res => Api.handleResponse(res as XMLHttpRequest))
				.then(res => {
					if (res.status && res.response.id) {
						Api.getChats({});
						resolve(res.response);
					} else {
						reject(res.response);
					}
				})
				.catch(error => {
					Api.catchError(error)
				});
		});
	}

	// Удалить чат
	public static deleteChat(): void {
		const chatId = Api.getCurrentChatId();
		if (chatId > 0 && Api._socket) {
			Fetch.delete({path: '/chats', data: {chatId}})
				.then(() => {
					Api.closeChat();
					Api.getChats({});
				})
				.catch(error => {
					Api.catchError(error)
				});
		}
	}

	// Закрыть чат
	public static closeChat(): void {
		store.unset('currentChatId');
		store.unset('messages');
		store.unset('currentChatUsers');
		Api.closeWebSocket();
	}

	// Пользователи чата
	public static getChatUsers(id: number | string): Promise<Record<string, unknown> | unknown[]> {
		return new Promise((resolve, reject) => {
			Fetch.get({path: `/chats/${id}/users`})
				.then(res => Api.handleResponse(res as XMLHttpRequest))
				.then(res => {
					if (res.status) {
						store.unset('currentChatUsers');
						if (Object.keys(res.response).length > 0) {
							Object.values(res.response as object).forEach(user => {
								if (!user.display_name) {
									user.display_name = user.login;
								}
								if (user.avatar) {
									user.avatar =
										`${Api._avatarUrlPrefix}${user.avatar}`;
								} else {
									user.avatarText
										= (user.display_name as string).charAt(0).toUpperCase();
								}
							});
							store.set('currentChatUsers', res.response);
						}
						resolve(res.response);
					} else {
						reject(res.response);
					}
				})
				.catch(error => {
					Api.catchError(error)
				});
		});
	}

	// Загрузка сообщений из чата
	public static openChat(chatId: string): void {
		Api.closeChat();
		Api.getChatUsers(chatId)
			.then(() => {
				Fetch.post({path: `/chats/token/${chatId}`})
					.then(res => Api.handleResponse(res as XMLHttpRequest))
					.then(res => {
						store.set('currentChatId', chatId);
						const token = res.response.token;
						const userId = store.getState().currentUser?.id;
						const socket = new WebSocket('wss://ya-praktikum.tech/ws/chats' +
							`/${userId}/${chatId}/${token}`);
						Api._socket = socket;

						socket.addEventListener('open', () => {
							console.log('Соединение установлено');
							store.unset('messages');
							Api.loadOldMessages();
							Api.getChats({});
							Api._socketPingInterval = setInterval(function () {
								socket.send(JSON.stringify({type: "ping"}));
							}, 20000);
						});

						socket.addEventListener('close', event => {
							store.unset('messages');
							if (Api._socketPingInterval) {
								clearInterval(Api._socketPingInterval);
							}
							if (event.wasClean) {
								console.log('Соединение закрыто чисто');
							} else {
								console.log('Обрыв соединения');
								Api.openChat(chatId);
							}
							console.log(`Код: ${event.code} | Причина: ${event.reason}`);
						});

						socket.addEventListener('message', event => {
							const data = JSON.parse(event.data);
							let messagesLoaded = 0;
							let messageMaxId = 0
							if (data instanceof Array) {
								data.forEach(msg => {
									if (msg.type === "message") {
										store.set('messages', {[`a${msg.id}`]: msg});
										if (messageMaxId < msg.id) {
											messageMaxId = msg.id;
										}
									}
									messagesLoaded++;
								});
								if (messagesLoaded === 20) {
									Api.loadOldMessages(messageMaxId);
								}
							} else {
								if (data.type === "message") {
									store.set('messages', {[`a${data.id}`]: data});
								}
							}
						});

						socket.addEventListener('error', event => {
							console.error('Ошибка',
								(event as object as { message: string }).message);
						});

					})
					.catch(error => {
						Api.catchError(error)
					});
			})
			.catch(error => {
				Api.catchError(error)
			});
	}

	// Получение старых сообщений чата
	public static loadOldMessages(offset: number = 0): void {
		const chatId = Api.getCurrentChatId();
		if (chatId > 0 && Api._socket) {
			Api._socket.send(JSON.stringify({
				content: `${offset}`,
				type: "get old"
			}));
		}
	}

	// Отправка нового сообщения
	public static postNewMessage(text: string): void {
		const chatId = Api.getCurrentChatId();
		if (chatId > 0 && Api._socket) {
			Api._socket.send(JSON.stringify({
				content: text,
				type: 'message',
			}));
		}
	}

	// Добавление пользователя в чат
	public static addUserToChat(userId: string): void {
		const chatId = Api.getCurrentChatId();
		Fetch.put({path: '/chats/users', data: {users: [userId], chatId: chatId}})
			.then(res => Api.handleResponse(res as XMLHttpRequest))
			.then(res => {
				if (res.status) {
					Api.getChatUsers(chatId);
				}
			})
			.catch(error => {
				Api.catchError(error)
			});
	}

	// Удаление пользователя из чата
	public static deleteUserFromChat(userId: string): void {
		const chatId = Api.getCurrentChatId();
		Fetch.delete({path: '/chats/users', data: {users: [userId], chatId: chatId}})
			.then(res => Api.handleResponse(res as XMLHttpRequest))
			.then(res => {
				if (res.status) {
					Api.getChatUsers(chatId);
				}
			})
			.catch(error => {
				Api.catchError(error)
			});
	}

	// Изменить аватар чата
	public static changeChatAvatar(file: File): void {
		const chatId = Api.getCurrentChatId().toString();
		const data = new FormData();
		data.append('avatar', file);
		data.append('chatId', chatId);
		Fetch.put({path: '/chats/avatar', data})
			.then(() => Api.getChats({}))
			.catch(error => {
				Api.catchError(error)
			});
	}

	// Id текущего чата
	public static getCurrentChatId(): number {
		return store.getState().currentChatId ?? 0;
	}

	// Закрытие сокета
	private static closeWebSocket(): void {
		if (Api._socket) {
			Api._socket.close();
		}
	}

	// Обработка ответа - проверяем статус и парсим тело ответа
	private static handleResponse(res: XMLHttpRequest): {
		status: boolean; response: Record<string, unknown>
	} {
		let responseObject;
		try {
			responseObject = JSON.parse(res.response);
		} catch (e) {
			responseObject = {text: res.response};
		}
		if (res.status === 500) {
			Alert.fatal(['Unexpected error', res.response.reason])
		}
		return {
			status: res.status === 200,
			response: responseObject
		};
	}

	private static catchError(error: XMLHttpRequest) {
		console.error('API error!');
		console.error(error);
		// throw new Error(JSON.parse(error.responseText));
	}
}


