import Fetch from "~src/modules/fetch";
import Alert from "~src/components/window/alert";
import {store} from "~src/modules/store";

// Модуль Авторизации.

type authType = Record<string, string>;

export default class Auth {

	private static _socket: WebSocket;
	private static _socketPingInterval: number;

	// Префикс для аватарок
	private static _avatarUrlPrefix = 'https://ya-praktikum.tech/api/v2/resources';

	// Регистрация
	public static signUp(data: authType): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				Fetch.post({path: '/auth/signup', data})
					.then(res => Auth.handleResponse(res as XMLHttpRequest))
					.then(res => {
						if (res.status) {
							store.reset();
							Auth.isAuthorized()
								.then(() => resolve(res.response))
								.catch(error => {
									Auth.catchError(error)
								});
						} else {
							reject(res.response);
						}
					})
					.catch(error => {
						Auth.catchError(error)
					});
			}, 500);
		});
	}

	// Авторизация
	public static signIn(data: authType): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				Fetch.post({path: '/auth/signin', data})
					.then(res => Auth.handleResponse(res as XMLHttpRequest))
					.then(res => {
						if (res.status && res.response.text === 'OK') {
							resolve(res.response);
							Auth.getChats({});
						} else {
							reject(res.response);
						}
					})
					.catch(error => {
						Auth.catchError(error)
					});
			}, 500);
		});
	}

	// Выход
	public static logout(): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				Auth.closeWebSocket();
				Fetch.post({path: '/auth/logout'})
					.then(res => Auth.handleResponse(res as XMLHttpRequest))
					.then(res => {
						if (res.status) {
							store.reset();
							resolve(res.response);
						} else {
							reject(res.response);
						}
					})
					.catch(error => {
						Auth.catchError(error);
					});
			}, 500);
		});
	}

	// Получение данных о текущем пользователе
	public static getMyUserInfo(): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				Fetch.get({path: '/auth/user'})
					.then(res => Auth.handleResponse(res as XMLHttpRequest))
					.then(res => {
						if (res.status) {
							if (!res.response.display_name) {
								res.response.display_name = res.response.login;
							}
							if(res.response.avatar) {
								res.response.avatar =
									`${Auth._avatarUrlPrefix}${res.response.avatar}`;
							}else{
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
						Auth.catchError(error)
					});
			}, 500);
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
				Auth.getMyUserInfo()
					.then(res => {
						resolve(res);
						Auth.getChats({});
					})
					.catch(res => reject(res));
			}
		});


	}

	// Изменение данных пользователя
	public static editProfile(data: authType): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				Fetch.put({path: '/user/profile', data})
					.then(res => Auth.handleResponse(res as XMLHttpRequest))
					.then(res => {
						if (res.status) {
							Auth.getMyUserInfo()
								.then(() => resolve(res.response));
						} else {
							reject(res.response);
						}
					})
					.catch(error => {
						Auth.catchError(error)
					});
			}, 500);
		});
	}

	// Изменение данных пользователя
	public static editAvatar(file: File): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const data = new FormData();
				data.append('avatar', file);
				Fetch.put({path: '/user/profile/avatar', data})
					.then(res => Auth.handleResponse(res as XMLHttpRequest))
					.then(res => {
						if (res.status) {
							res.response.avatarText='';
							res.response.avatar =
								`${Auth._avatarUrlPrefix}/${res.response.avatar}`;
							store.set('currentUser', res.response);
							resolve(res.response);
						} else {
							reject(res.response);
						}
					})
					.catch(error => {
						Auth.catchError(error)
					});
			}, 500);
		});
	}

	// Изменение пароля
	public static changePassword(data: authType): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				Fetch.put({path: '/user/password', data})
					.then(res => Auth.handleResponse(res as XMLHttpRequest))
					.then(res => {
						(res.status && res.response.text === 'OK')
							? resolve(res.response)
							: reject(res.response);
					})
					.catch(error => {
						Auth.catchError(error)
					});
			}, 500);
		});
	}

	// Получаем список чатов
	public static getChats(data: authType): void {
		// return new Promise((resolve, reject) => {
		setTimeout(() => {
			Fetch.get({path: '/chats', data})
				.then(res => Auth.handleResponse(res as XMLHttpRequest))
				.then(res => {
					store.unset('chats');
					Object.values(res.response as object).forEach(chat => {
						if(chat.avatar){
							chat.avatar=`${Auth._avatarUrlPrefix}${chat.avatar}`;
						}else{
							chat.avatarText = chat.title.charAt(0).toUpperCase();
						}
					});
					store.set('chats', res.response);
				})
				.catch(error => {
					Auth.catchError(error)
				});
		}, 1000);
		// });
	}

	// Поиск пользователя
	public static findUser(data: authType): Promise<Record<string, unknown> | unknown[]> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				Fetch.post({path: '/user/search', data})
					.then(res => Auth.handleResponse(res as XMLHttpRequest))
					.then(res => {
						if (res.status) {
							Auth.clearFoundUsers();
							if (Object.keys(res.response).length > 0) {
								Object.values(res.response as object).forEach(user => {
									if (!user.display_name) {
										user.display_name = user.login;
									}
									if(user.avatar) {
										user.avatar =
											`${Auth._avatarUrlPrefix}${user.avatar}`;
									}else{
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
						Auth.catchError(error)
					});
			}, 500);
		});
	}

	// Очистка списка найденных пользователей
	public static clearFoundUsers(): void {
		store.unset('foundUsers');
	}

	// Новый чат
	public static createChat(title: string): Promise<Record<string, unknown> | unknown[]> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				Fetch.post({path: '/chats', data: {title}})
					.then(res => Auth.handleResponse(res as XMLHttpRequest))
					.then(res => {
						if (res.status && res.response.id) {
							Auth.getChats({});
							resolve(res.response);
						} else {
							reject(res.response);
						}
					})
					.catch(error => {
						Auth.catchError(error)
					});
			}, 500);
		});
	}

	// Удалить чат
	public static deleteChat(): void {
			const chatId = Auth.getCurrentChatId();
			if (chatId > 0 && Auth._socket) {
			setTimeout(() => {
				Fetch.delete({path: '/chats', data: {chatId}})
					.then(() => {
						Auth.closeChat();
						Auth.getChats({});
					})
					.catch(error => {
						Auth.catchError(error)
					});
			}, 500);
		}
	}

	// Закрыть чат
	public static closeChat(): void {
		store.unset('currentChatId');
		store.unset('messages');
		store.unset('currentChatUsers');
	}

	// Пользователи чата
	public static getChatUsers(id: number | string): Promise<Record<string, unknown> | unknown[]> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				Fetch.get({path: `/chats/${id}/users`})
					.then(res => Auth.handleResponse(res as XMLHttpRequest))
					.then(res => {
						if (res.status) {
							store.unset('currentChatUsers');
							if (Object.keys(res.response).length > 0) {
								Object.values(res.response as object).forEach(user => {
									if (!user.display_name) {
										user.display_name = user.login;
									}
									if(user.avatar) {
										user.avatar =
											`${Auth._avatarUrlPrefix}${user.avatar}`;
									}else{
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
						Auth.catchError(error)
					});
			}, 500);
		});
	}

	// Загрузка сообщений из чата
	public static openChat(chatId: string): void {
		Auth.closeChat();
		setTimeout(() => {
			Auth.closeWebSocket();
			Auth.getChatUsers(chatId)
				.then(() => {
					Fetch.post({path: `/chats/token/${chatId}`})
						.then(res => Auth.handleResponse(res as XMLHttpRequest))
						.then(res => {
							store.set('currentChatId', chatId);
							const token = res.response.token;
							const userId = store.getState().currentUser?.id;
							const socket = new WebSocket('wss://ya-praktikum.tech/ws/chats' +
								`/${userId}/${chatId}/${token}`);
							Auth._socket = socket;

							socket.addEventListener('open', () => {
								console.log('Соединение установлено');
								store.unset('messages');
								Auth.loadOldMessages();
								Auth.getChats({});
								Auth._socketPingInterval = setInterval(function () {
									socket.send(JSON.stringify({type: "ping"}));
								}, 20000);
							});

							socket.addEventListener('close', event => {
								store.unset('messages');
								if (Auth._socketPingInterval) {
									clearInterval(Auth._socketPingInterval);
								}
								if (event.wasClean) {
									console.log('Соединение закрыто чисто');
								} else {
									console.log('Обрыв соединения');
									Auth.openChat(chatId);
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
										Auth.loadOldMessages(messageMaxId);
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
							Auth.catchError(error)
						});
				})
				.catch(error => {
					Auth.catchError(error)
				});
		},500);
	}

	// Получение старых сообщений чата
	public static loadOldMessages(offset: number = 0): void {
		const chatId = Auth.getCurrentChatId();
		if (chatId > 0 && Auth._socket) {
			Auth._socket.send(JSON.stringify({
				content: `${offset}`,
				type: "get old"
			}));
		}
	}

	// Отправка нового сообщения
	public static postNewMessage(text: string): void {
		const chatId = Auth.getCurrentChatId();
		if (chatId > 0 && Auth._socket) {
			Auth._socket.send(JSON.stringify({
				content: text,
				type: 'message',
			}));
		}
	}

	// Добавление пользователя в чат
	public static addUserToChat(userId: string): void {
		const chatId = Auth.getCurrentChatId();
		setTimeout(() => {
			Fetch.put({path: '/chats/users', data: {users: [userId], chatId: chatId}})
				.then(res => Auth.handleResponse(res as XMLHttpRequest))
				.then(res => {
					if (res.status) {
						Auth.getChatUsers(chatId);
					}
				})
				.catch(error => {
					Auth.catchError(error)
				});
		}, 500);
	}

	// Удаление пользователя из чата
	public static deleteUserFromChat(userId: string): void {
		const chatId = Auth.getCurrentChatId();
		setTimeout(() => {
			Fetch.delete({path: '/chats/users', data: {users: [userId], chatId: chatId}})
				.then(res => Auth.handleResponse(res as XMLHttpRequest))
				.then(res => {
					if (res.status) {
						Auth.getChatUsers(chatId);
					}
				})
				.catch(error => {
					Auth.catchError(error)
				});
		}, 500);
	}

	// Изменить аватар чата
	public static changeChatAvatar(file: File): void {
		const chatId = Auth.getCurrentChatId().toString();
		setTimeout(() => {
			const data = new FormData();
			data.append('avatar', file);
			data.append('chatId', chatId);
			Fetch.put({path: '/chats/avatar', data})
				.then(() => Auth.getChats({}))
				.catch(error => {
					Auth.catchError(error)
				});
		}, 500);
	}

	public static getCurrentChatId(): number {
		return store.getState().currentChatId ?? 0;
	}

	// Закрытие сокета
	private static closeWebSocket(): void {
		if (Auth._socket) {
			Auth._socket.close();
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


