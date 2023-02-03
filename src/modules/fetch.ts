// Модуль Fetch. Отвечает за общение с сервером
// Пока только имитация (выводит в консоль данные для запроса)

// Доступные режимы
enum METHODS {
	GET = 'GET',
	POST = 'POST',
	DELETE = 'DELETE'
}

// Адрес сервера
const messengerServer = 'https://messenger.ru'

// Метод превращения объекта с втроку
function queryStringify(data: Record<string, unknown>): string {
	let str = '?';
	for (const key in data) {
		str += `${key}=${data[key]}&`;
	}
	return str.slice(0, -1);
}

// Тип данных для тела запроса
type optionsType = {
	path?: string
	timeout?: number,
	data?: Record<string, unknown> | string,
	[key: string]: unknown;
};

export default class Fetch {
	public static get(options: optionsType = {}) {
		if (options.data && typeof options.data!=='string') {
			options.data = queryStringify(options.data);
		}
		return Fetch._request(messengerServer, {...options, method: METHODS.GET});
	}

	public static post = (options: optionsType = {}) => {
		return Fetch._request(messengerServer, {...options, method: METHODS.POST});
	}

	public static delete = (options: optionsType = {}) => {
		return Fetch._request(messengerServer, {...options, method: METHODS.DELETE});
	}

	// Метод отправки запроса
	private static _request = (url: string, options: optionsType) => {
		const {
			path,
			method = METHODS.GET,
			data,
			timeout = 5000
		} = options;

		return new Promise((resolve, reject) => {
			// eslint-disable-next-line no-undef
			const xhr = new XMLHttpRequest();

			if(path){
				url+=path;
			}

			if (method === METHODS.GET && data) {
				url += data;
			}

			xhr.open(method as string, url);

			xhr.onload = () => resolve(xhr);

			xhr.timeout = timeout;

			xhr.onabort = reject;
			xhr.onerror = reject;
			xhr.ontimeout = reject;

			if (method === METHODS.GET || !data) {
				xhr.send();
			} else {
				xhr.send(data as XMLHttpRequestBodyInit);
			}

			console.log(`Запрос ${method} на адрес ${url}`);
		});
	};
}
