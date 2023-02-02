import tpl from './tpl.hbs';
import './style.scss';
import View from "~src/components/view";
import Window from "~src/components/window";
import Content from "~src/components/content";
import Alert from "~src/components/window/alert";
import Input from "~src/components/input";
import Button from "~src/components/button";
// import Chat from "~src/modules/chat";
import ChatFeed from "~src/components/chat-feed";
import Chatlist from "~src/components/chatlist";
import User from "~src/modules/user";
import Routing from "~src/modules/routing";
import Form from "~src/components/form";

// Страничка Мессенджера.
// Возвращает большое окно, состоящее из двух больших компонентов: Списка чатов (Chatlist)
// и Ленты сообщений (ChatFeed).

export default (rootElement: View): Window => {

	// Создаём экземпляр класса отображения окон с сообщениями или ошибками
	// const alert =
		new Alert({rootElement});

	// Получаем никтейм и аватар текущего пользователя
	const {nickname, avatar} = User.getMyUser().data();

	// Создаём содержимое окна по шаблону
	const content = new Content({
		template: tpl,
		nickname,
		avatar,
		children: {
			details: [
				new Button({
					className: 'details',
					text: 'Детали',
					events: {
						'click': () => Routing('/profile', rootElement)
					}
				})],
			search: [
				new Input({
					className: 'inputSearch'
				}),
				new Button({
					type: 'submit',
					className: 'buttonSearch',
					text: 'Найти'
				})],
		}
	});

	const searchForm = Form.makeForm(content.subElement('form.search'));
	searchForm.props.events={
		'submit': (e: SubmitEvent) => {
			e.preventDefault();
			console.log('Метод поиска сообщений');
		}
	}

	// Создаём окно с созданным выше содержимым
	const window = new Window({
		className: 'messenger',
		title: 'WinChat 98 - Электронные диалоги',
		controls: {
			close: true
		},
		children: {
			content: [content]  // Передаем содержимое в чилдрены
		}
	});

	// Вызываем обновление чилдренов окна
	// В аргументах true - для рекурсии, чтобы вложенные дочерние элементы тоже обновились
	window.updateChildren(true);

	const chatFeed = new ChatFeed({});
	const chatlist = new Chatlist({chatFeed});
	content.children.chatlist=[chatlist];
	content.children.chatFeed=[chatFeed];

	content.updateChildren();

	return window;

}
