import tpl from './tpl.hbs';
import Window from "~src/components/window";
import {button} from "~src/components/button";
import {inputWithLabel} from "~src/components/input";
import "./style.scss";
import {generateDom} from "~src/components/components";

export default (rootElement: HTMLElement) => {

    // Генерируем окно
    const page: Window = new Window({
        id: 'sign-in',
        className: 'sign-in',
        title: 'WinChat 98 - Электронные диалоги'
    });
    rootElement.append(page.document());


    // Генерируем контент окна по шаблону
    const document: HTMLElement = generateDom(tpl({
        loginLine: inputWithLabel({
            id: 'login',
            name: 'login',
            type: 'text',
            label: 'Логин:',
            isStacked: false
        }),
        passwordLine: inputWithLabel({
            id: 'password',
            type: 'password',
            name: 'password',
            label: 'Пароль:',
            isStacked: false
        }),
        buttonSubmit: button({
            id: 'submit',
            name: 'submit',
            type: 'submit',
            value: 'Вход'
        }),
        buttonRegister: button({
            id: 'registration',
            name: 'registration',
            type: 'button',
            value: 'Регистрация'
        })
    }));
    page.content().append(document);

    // Находим инпуты и кнопки на будущее
    // const inputLogin: HTMLElement = page.subElement('input#login');
    // const inputPassword: HTMLElement = page.subElement('input#password');
    // const buttonSubmit: HTMLElement = page.subElement('button#submit');
    // const buttonRegister: HTMLElement = page.subElement('button#registration');
}
