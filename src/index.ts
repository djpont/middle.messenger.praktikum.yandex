// import '/static/index.css';
import Routing from "./routing";
import Chat from "~src/modules/chat";
import User from "~src/modules/user";
import {messageStatus} from "~src/modules/message";

import avatar100 from '~static/images/user100.webp';
import avatar101 from '~static/images/user101.webp';
import avatar102 from '~static/images/user102.webp';
import avatar103 from '~static/images/user103.webp';
import avatar104 from '~static/images/user104.webp';
// import {userData} from "~src/modules/user";

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
        users: [myUser, User.getUserById('102'), User.getUserById('103'), User.getUserById('104')]
    },
].map(({id, title, avatar, users}) => {
    new Chat({
        id,
        title,
        avatar,
        users,
        messages:[]
    });
});

// Список сообщений в чатах
[
    {id: '51', chat: '501', user: '100', datetime: '2023-01-01 15:10', text: "Hello! How are you?"},
    {id: '52', chat: '501', user: '101', datetime: '2023-01-01 15:15', text: "Hi! I'm fine!"},
    {id: '53', chat: '502', user: '102', datetime: '2023-01-01 15:20', text: "Hey, I saw you at the movies yesterday."},
    {id: '54', chat: '502', user: '102', datetime: '2023-01-01 15:25', text: "It was a great movie, wasn't it?"},
    {id: '55', chat: '502', user: '100', datetime: '2023-01-01 15:30', text: "Yeah, I enjoyed it."},
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

// Находим элемент, куда будем рисовать контент и запускаем роутинг
const root = document.getElementById('root');
if(root===null){
    throw new Error(`Корневой элемент не найден`)
}
Routing(document.location.pathname, root);
