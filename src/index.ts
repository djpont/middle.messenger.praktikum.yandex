// import '/static/index.css';
import Chat from "~src/modules/chat";
import User from "~src/modules/user";
import {messageStatus} from "~src/modules/message";
import View from "~src/components/view";
import Routing, {Route} from "./modules/routing";

import PageSignIn from '~src/pages/sign-in';
import PageSignUp from '~src/pages/sign-up';
import page404 from '~src/pages/error/404';
import page500 from '~src/pages/error/500';
import Messenger from "~src/pages/messenger";
import Profile from "~src/pages/profile";
import Options from "~src/pages/options";
import FileUpload from "~src/pages/file-upload";


// Аватарки пользователей
import avatar100 from '~static/images/user100.webp';
import avatar101 from '~static/images/user101.webp';
import avatar102 from '~static/images/user102.webp';
import avatar103 from '~static/images/user103.webp';
import avatar104 from '~static/images/user104.webp';
import Alert from "~src/components/window/alert";
import Auth from "~src/modules/auth";
// В этих фигурных скобках находится временный код для имитации данных мессенджера,
// который в будущем будет заменяться данными, получаемыми с сервера
{
// Текущий пользователь
	const myUser = new User({
		id: '100',
		login: 'djpont',
		nickname: 'djpont',
		avatar: avatar100
	});
	User.setMyUser(myUser);

// Список пользователей для чатов
	[
		{id: '101', login: 'RainbowSmile', nickname: 'RainbowSmile', avatar: avatar101},
		{id: '102', login: 'SuperStar7', nickname: 'SuperStar7', avatar: avatar102},
		{id: '103', login: 'Sunshine_Girl', nickname: 'Sunshine_Girl', avatar: avatar103},
		{id: '104', login: 'Cyber_King', nickname: 'Cyber_King', avatar: avatar104}]
		.map(({id, login, nickname, avatar}) => {
			new User({
				id,
				login,
				nickname,
				avatar
			});
		});

// Список чатов
	[
		{id: '501', title: 'Чат1', avatar: avatar101, users: [myUser, User.getUserById('101')]},
		{id: '502', title: 'Чат2', avatar: avatar102, users: [myUser, User.getUserById('102')]},
		{
			id: '503',
			title: 'Чат3',
			avatar: avatar103,
			users: [myUser,
				User.getUserById('102'),
				User.getUserById('103'),
				User.getUserById('104')]
		},
	].map(({id, title, avatar, users}) => {
		new Chat({
			id,
			title,
			avatar,
			users,
			messages: []
		});
	});

// Список сообщений в чатах
	[
		{
			id: '51',
			chat: '501',
			user: '100',
			datetime: '2023-01-01 15:10',
			text: "Hello! How are you?"
		},
		{id: '52', chat: '501', user: '101', datetime: '2023-01-01 15:15', text: "Hi! I'm fine!"},
		{
			id: '53', chat: '502', user: '102', datetime: '2023-01-01 15:20',
			text: "Hey, I saw you at the movies yesterday."
		},
		{
			id: '54', chat: '502', user: '102', datetime: '2023-01-01 15:25',
			text: "It was a great movie, wasn't it?"
		},
		{
			id: '55',
			chat: '502',
			user: '100',
			datetime: '2023-01-01 15:30',
			text: "Yeah, I enjoyed it."
		},
		{id: '56', chat: '503', user: '103', datetime: '2023-01-01 15:35', text: "Hi! What's up?"},
		{
			id: '57',
			chat: '503',
			user: '104',
			datetime: '2023-01-01 15:35',
			text: "Nothing much, just studying for an exam. How about you?"
		},
		{
			id: '58',
			chat: '503',
			user: '103',
			datetime: '2023-01-01 15:35',
			text: "Same here, I'm trying to get all the material for the exam."
		},
		{
			id: '59',
			chat: '503',
			user: '104',
			datetime: '2023-01-01 15:35',
			text: "That's great! I think it's better to start studying early."
		},
		{id: '60', chat: '503', user: '103', datetime: '2023-01-01 15:35', text: "Absolutely."},
	].map(({id, chat, user, datetime, text}) => {
		Chat.getChatById(chat).addMessage({
			id,
			user: User.getUserById(user),
			datetime,
			text,
			status: messageStatus.read
		});
	});
}


// Фиксируем возможные пути для роутинга
export const PATHS = {
	signIn: '/sign-in',
	signUp: '/sign-up',
	error404: '/404',
	error500: '/500',
	messenger: '/messenger',
	profile: '/profile',
	options: '/options',
	fileUpload: '/file-upload'
} as const;

// Создаём конревой элемент и применяем его в классы роутинга и алерта
const view = new View({rootElement: document.body});
Routing.setView(view);
Alert.setView(view);
// Роутинг странички входа указываем как дефолтный роут (на случай, если пользователь неавторизован)
const routeSignIn = Routing.use({
	path: PATHS.signIn,
	window: PageSignIn,
	layer: View.LAYERS.main,
	checkFunction: checkIfAlreadyAutorized
});
const routeMessenger = Routing.use({
	path: PATHS.messenger,
	window: new Messenger({
		callbacks: {
			optionsCallback: () => Routing.go(PATHS.options),
			detailsCallback: () => Routing.go(PATHS.profile),
			logoutCallback: () => Routing.go(PATHS.signIn)
		}
	}),
	layer: View.LAYERS.main,
	checkFunction: checkIfNeedAutorize
});
// Ростинг странички 404 указываем как роут для ошибок 404
Routing.set404(Routing.use({
	path: PATHS.error404,
	window: page404(),
	layer: View.LAYERS.alert
}));
// // Прочие роуты
Routing.use({
	path: PATHS.signUp,
	window: PageSignUp,
	layer: View.LAYERS.main,
	checkFunction: checkIfAlreadyAutorized
});
Routing.use({
	path: PATHS.profile,
	window: new Profile({}),
	layer: View.LAYERS.second,
	checkFunction: checkIfNeedAutorize
});
Routing.use({
	path: PATHS.options,
	window: new Options({
		callbacks: {
			deleteChat: Auth.deleteChat,
			avatarChat: Auth.changeChatAvatar
		}
	}),
	layer: View.LAYERS.second,
	checkFunction: checkIfNeedAutorize
});
Routing.use({
	path: PATHS.fileUpload,
	window: FileUpload,
	layer: View.LAYERS.second,
	checkFunction: checkIfNeedAutorize
});

Routing.use({
	path: PATHS.error500,
	window: page500(),
	layer: View.LAYERS.alert
});
// Запускаем Роутинг
setTimeout(() => Routing.go(document.location.pathname), 200);

// При нажатии на кноки назад или вперед снова вызываем роутинг
window.addEventListener('popstate', () => {
	Routing.go(document.location.pathname);
});

// Функция проверки доступа - если неавторизован, то перенаправляет на страничку авторизации
async function checkIfNeedAutorize(nextRoute: Route): Promise<Route> {
	return new Promise((resolve) => {
		Auth.isAuthorized()
			.then(() => {
				resolve(nextRoute) // Если авторизован - пускаем
			})
			.catch(() => {
				resolve(routeSignIn) // Если нет - редирект
			});
	});
}

// Функция проверки доступа - если авторизован, то перенаправляет на мессенджер
async function checkIfAlreadyAutorized(nextRoute: Route): Promise<Route> {
	return new Promise((resolve) => {
		Auth.isAuthorized()
			.then(() => {
				resolve(routeMessenger) // Если авторизован - редирект
			})
			.catch(() => {
				resolve(nextRoute) // Если нет - пускаем
			});
	});
}


/// -------

// type Indexed<T = any> = { [key in string]: T; };
//
// function merge(object1: Indexed, object2: Indexed): Indexed {
// 	const result = object1;
// 	for (const key in object2) {
// 		if (object1[key] === undefined) {
// 			object1[key] = {};
// 		}
// 		if (typeof object2[key] === "object") {
// 			result[key] = merge(object1[key], object2[key]);
// 		} else {
// 			result[key] = object2[key];
// 		}
// 	}
// 	return result;
// }
//
//


// function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
// 	if (typeof path !== 'string') {
// 		throw new Error('path must be string');
// 	}
// 	if (!(object instanceof Object)) {
// 		return object;
// 	}
//
// 	const object2: Indexed = {};
// 	const pathArray = path.split('.');
// 	pathArray.reduce((obj, key, index) => {
// 		if (index === pathArray.length - 1) {
// 			obj[key] = value;
// 		} else {
// 			obj[key] = {};
// 		}
// 		return obj[key];
// 	}, object2);
//
// 	// console.log(object);
// 	// console.log(object2);
//
// 	object = merge(object, object2);
//
// 	return object;
// }
//


// function isEqual(a: object, b: object): boolean {
// 	console.log(a,b);
// 	if(Object.keys(a).length===Object.keys(b).length){
// 		for(let key in a){
// 			key = key as keyof object;
// 			if(typeof a[key] === typeof b[key]){
// 				if(typeof a[key] === 'object' && a[key]!==null){
// 					if(!isEqual(a[key], b[key])){
// 						return false;
// 					}
// 				}else{
// 					if(!(a[key as any]===b[key as any])){
// 						return false;
// 					}
// 				}
// 			}else{
// 				return false;
// 			}
// 		}
// 	}else{
// 		return false;
// 	}
// 	return true;
// }
//
// const a = {bar: null};
// const b = {bar: {}};
//
// console.log(isEqual(a,b));


// function cloneDeep<T extends object = object>(obj: T) {
// 	let copy: any;
// 	if (typeof obj === 'object' && obj!==null) {
// 		copy = Array.isArray(obj) ? [] : {};
// 		for (const key in obj) {
// 			copy[key] = cloneDeep(obj as unknown[key] as T);
// 		}
// 	}else{
// 		copy = obj;
// 	}
// 	return copy;
// }
//
//
// const a = {foo: 2, bar: 4, baz: {a:1, b:3, c:[1,2,3]}};
// const b = cloneDeep(a);
// console.log(a);
// console.log(b);


//
// type StringIndexed = Record<string, any>;
//
// const obj: StringIndexed = {
// 	key: 1,
// 	key2: 'test',
// 	key3: false,
// 	key4: true,
// 	key5: [1, 2, 3],
// 	key6: {a: 1},
// 	key7: {b: {d: 2}},
// };
//


// function queryStringify(data: StringIndexed, prefix: string = ''): string | never {
// 	if(typeof data !== 'object' || data===null){
// 		throw new Error('input must be an object');
// 	}
// 	let getString='';
// 	for(const key in data){
// 		if(typeof data[key] === 'object' && typeof data[key]!==null){
// 			let newPrefix;
// 			if(prefix.length>0){
// 				newPrefix=`${prefix}[${key}]`;
// 			}else{
// 				newPrefix=key;
// 			}
// 			getString+=queryStringify(data[key], newPrefix);
// 		}else{
// 			if(prefix.length>0){
// 				getString+=`${prefix}[${key}]=${data[key]}&`;
// 			}else{
// 				getString+=`${key}=${data[key]}&`;
// 			}
// 		}
// 	}
// 	if(prefix===''){
// 		getString=getString.substring(0, getString.length-1);
// 	}
// 	return getString;
// }
//
// const a = queryStringify(obj);
// console.log(a);














