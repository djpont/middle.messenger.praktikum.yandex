import tpl from './tpl.hbs';
import tpl_message from './tpl_message.hbs';
import tpl_dateString from './tpl_datestring.hbs';
import './style.scss';
import BaseComponent, {ComponentPropsData} from "~src/components/components";
import {Fn, generateDom} from "~src/modules/functions";
import Button from "~src/components/button";
import Input from "~src/components/input";
// import fileUpload from "~src/pages/file-upload";
// import Alert from "~src/components/window/alert";
import Validator from "~src/modules/validator";
import Form from "~src/components/form";
// import Message from "~src/components/chatfeed/message";

// Компонент chatFeed отвечает за ленту сообщений и поля для оптравки нового сообщения

type messageData = {
	content: string,
	timeShort: string,
	displayName: string,
	way: string
}

const message = (data: messageData): string => {
	const {
		content,
		timeShort: time,
		displayName,
		way: className
	} = data;
	return tpl_message({content, displayName, time, className});
};

const dateString = (date: string): string => {
	return tpl_dateString({date});
}

// Тип данных для компонента chatFeed (пока не отличается от типа базового компонента)
type chatFeedData = {
	callback?: Fn<void, string>,
	optionsCallback?: Fn<void>
} & ComponentPropsData;

// Класс ленты сообщений
export default class ChatFeed extends BaseComponent<chatFeedData> {

	constructor(props: chatFeedData) {
		// Сначала создаём базовый компонент  и рендерим его
		super(props);
		// Делаем кнопки управляемыми
		this._makeNewMessageFormActive();
		// Делаем активной кнопку открытия опций чата
		if (this.props.optionsCallback) {
			Button.makeButton(
				this.subElement('div.header button.options'),
				{'click': this.props.optionsCallback}
				);
		}
	}

	// Метод рендера DOM-дерева ленты сообщений по шаблону
	protected override render(data: ComponentPropsData): HTMLElement {
		return generateDom(tpl(data));
	}

	// Метод превращения отрендеренных кнопок в управляемые экземпляры Button
	private _makeNewMessageFormActive(): void {
		// Превращаем инпут для ввода сообщения в экземпляр Input
		const inputMessage = Input.makeInput(
			this.subElement('div.newMessage input[name="message"]')
		);
		// Превращаем кнопку для отправки сообщения в экземпляр Button
		Button.makeButton(
			this.subElement('div.newMessage button[type="submit"]')
		);
		// Превращаем кнопку для прикрепления файла в экземпляр Button
		Button.makeButton(
			this.subElement('div.newMessage button.attach'),
			{
				'click': [
					//() => Alert.alertWindow(fileUpload(() => console.log('yopyoypyp!')))
				]
			}
		);
		// Превращаем форму в экземпляр Form и вешаем событие на submit
		const form = Form.makeForm(this.subElement('form'));
		form.props.events = {
			'submit': (e: SubmitEvent) => {
				e.preventDefault();
				// Сначала проверяем валидацию инпута
				const valid = Validator.validateInputWithAlert(inputMessage);
				// Если успешно, то выполянем запрос
				if (valid) {
					if (this.props.callback && inputMessage.props.value) {
						this.props.callback(inputMessage.props.value);
					}
					inputMessage.reset();
				}
			}
		}

	}

	// Метод обновления DOM-дерева после обновления пропса
	protected override _updateProp(prop: string): void {
		if (prop === 'chat') {
			this.document().style.display = 'none';
			if (this.props.chat && Object.keys(this.props.chat).length > 0) {
				this.document().style.display = 'flex';
				this.subElement('div.header div.chatName').textContent
					= this.props.chat['title'];
				this.subElement('div.header div.avatar').style.backgroundImage =
					`url('${this.props.chat['avatar']}')`;
				this.subElement('div.header div.avatar').textContent =
					this.props.chat['avatarText'];
			}

		} else if (prop === 'messages') {
			const feedBlock = this.subElement('div.feed div.feedBlockContainer');
			feedBlock.innerHTML = '';
			let prevDateString = '';
			if (this.props.messages && Object.keys(this.props.messages).length > 0) {
				Object.values(this.props.messages).forEach((msg) => {
					if (prevDateString !== msg.dateShort) {
						prevDateString = msg.dateShort;
						feedBlock.append(generateDom((dateString(msg.dateShort))));
					}
					feedBlock.append(generateDom(message(msg)));
				});
			}
			feedBlock.scrollIntoView(false);
		}
	}

	// Метод получения пропса из DOM-дерева
	protected override getProp(): { fromDom: boolean; value: unknown } {
		const result = {
			fromDom: false,
			value: ''
		}
		return result;
	}
}
