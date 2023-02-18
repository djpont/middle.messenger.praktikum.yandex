// Модуль Fetch. Отвечает за общение с сервером

// Доступные режимы
enum METHODS {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}

// Адрес сервера
const messengerServer = 'https://ya-praktikum.tech/api/v2'

// Метод превращения объекта с втроку
function queryStringify(data: object, prefix: string = ''): string {
	if(typeof data !== 'object' || data===null){
		throw new Error('input must be an object');
	}
	let getString='';
	for(const key in data){
		if(typeof data[key] === 'object' && typeof data[key]!==null){
			let newPrefix;
			if(prefix.length>0){
				newPrefix=`${prefix}[${key}]`;
			}else{
				newPrefix=key;
			}
			getString+=queryStringify(data[key], newPrefix)+'&';
		}else{
			if(prefix.length>0){
				getString+=`${prefix}[${key}]=${data[key]}&`;
			}else{
				getString+=`${key}=${data[key]}&`;
			}
		}
	}
	getString=getString.substring(0, getString.length-1);
	return getString;
}

// Тип данных для тела запроса
type optionsType = {
	path?: string
	timeout?: number,
	data?: Record<string, unknown> | FormData |string,
	[key: string]: unknown;
};

// Класс для работы с запросами
export default class Fetch {
	public static async get(options: optionsType = {}): Promise<unknown> {
		if (options.data && typeof options.data!=='string') {
			options.data = queryStringify(options.data);
		}
		return Fetch._request(messengerServer, {...options, method: METHODS.GET});
	}

	public static async post(options: optionsType = {}): Promise<unknown> {
		return Fetch._request(messengerServer, {...options, method: METHODS.POST});
	}

	public static async put(options: optionsType = {}): Promise<unknown>{
		return Fetch._request(messengerServer, {...options, method: METHODS.PUT});
	}

	public static async delete(options: optionsType = {}): Promise<unknown> {
		return Fetch._request(messengerServer, {...options, method: METHODS.DELETE});
	}

	// Метод отправки запроса
	private static async _request(url: string, options: optionsType): Promise<unknown> {
		const {
			path,
			method = METHODS.GET,
			timeout = 5000
		} = options;
		let {data} = options;

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			if(path){
				url+=path;
			}

			if (method === METHODS.GET && data) {
				url += data;
			}

			xhr.open(method as string, url, true);
			xhr.withCredentials = true;

			xhr.onload = () => resolve(xhr);

			xhr.timeout = timeout;

			xhr.onabort = reject;
			xhr.onerror = reject;
			xhr.ontimeout = reject;

			if(data){
				if(!(data instanceof FormData)) {
					xhr.setRequestHeader('Content-Type', 'application/json');
					data = JSON.stringify(data);
				}
			}

			if (method === METHODS.GET || !data) {
				xhr.send();
			} else {
				xhr.send(data as XMLHttpRequestBodyInit);
			}
		});
	}
}
