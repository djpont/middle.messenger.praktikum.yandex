import Fetch, {queryStringify} from "./fetch";

const serverUrl = "https://jsonplaceholder.typicode.com/posts";

const data = {
	login: "ivan",
	password: "Ivan12345"
}

describe('Fetch', () => {

	test('queryStringify должен превратить объект в строку',  () => {
		const str = "login=ivan&password=Ivan12345";
		expect(queryStringify(data)).toBe(str);
	});

	test('GET запрос', async () => {
		const response = await Fetch.get({server:serverUrl, path:'/1'}) as XMLHttpRequest;
		const responseObject = JSON.parse(response.response);
		expect(responseObject['id']).toBe(1);
	});

	test('POST запрос', async () => {
		const response = await Fetch.post({server:serverUrl, data:data}) as XMLHttpRequest;
		const responseObject = JSON.parse(response.response);
		expect(responseObject['login']).toBe(data.login);
	});
});

