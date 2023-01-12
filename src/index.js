// import '/static/index.css';
import Routing from "./routing";
import Chat from "./modules/chat";
import User from "./modules/user";
import {messageStatuses} from "./modules/message";

// Текущий пользователь
const myUser = new User(100, 'djpont');
User.setMyUser(myUser);

// Список пользователей для чатов
[{id: 101, login: 'RainbowSmile'},
	{id: 102, login: 'SuperStar7'},
	{id: 103, login: 'Sunshine_Girl'},
	{id: 104, login: 'Cyber_King'},
	{id: 105, login: 'Music_Lover'},
	{id: 106, login: 'Rocket_Power'},
	{id: 107, login: 'Crazy_Dancer'},
	{id: 108, login: 'Gamer_Fox'},
	{id: 109, login: 'Cloudy_Sky'},
	{id: 110, login: 'Lucky_Fighter'}]
	.map(({id, login}) => {
		new User(id, login);
	});

// Список пользователей для чатов
[{id: 501, title: 'Чат1', users: [myUser, User.getUserById(101)]},
	{id: 502, title: 'Чат2', users: [myUser, User.getUserById(102)]},
	{id: 503, title: 'Чат3', users: [myUser, User.getUserById(103), User.getUserById(104), User.getUserById(105)]},
].map(({id, title, users}) => {
	new Chat(id, title, '', users);
});

// Список сообщений в чатах
[{id: 51, chat:501, user:100, datetime: '2023-01-01 15:10', text: "Hello! How are you?"},
	{id: 52, chat: 501, user:101, datetime: '2023-01-01 15:15', text: "Hi! I'm fine!" },
	{id: 53, chat: 502, user:102, datetime: '2023-01-01 15:20', text: 'Cccc ccc ccc'},
	{id: 54, chat: 502, user:102, datetime: '2023-01-01 15:25', text: 'Dddddd ddddd'},
	{id: 55, chat: 502, user:102, datetime: '2023-01-01 15:30', text: 'Eeeeee eeeee'},
	{id: 56, chat: 503, user:103, datetime: '2023-01-01 15:35', text: 'Ffffff fffff'},
	{id: 56, chat: 503, user:104, datetime: '2023-01-01 15:35', text: 'Gggggg ggggg'},
	{id: 56, chat: 503, user:105, datetime: '2023-01-01 15:35', text: 'Iiiiii iiiii'},
	{id: 56, chat: 503, user:105, datetime: '2023-01-01 15:35', text: 'Jjjjjj jjjjj'},
	{id: 56, chat: 503, user:105, datetime: '2023-01-01 15:35', text: 'Kkkkkk kkkkk'},
].map(({id, chat, user, datetime, text}) => {
	Chat.getChatById(chat).addMessage(id, User.getUserById(user), datetime, text, messageStatuses.read);
});


const root = document.getElementById('root');

Routing(document.location.pathname, root);

