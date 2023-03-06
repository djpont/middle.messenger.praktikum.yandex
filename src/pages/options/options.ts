import tpl from './tpl.hbs';
import './style.scss';
import {ComponentPropsData} from "../../components/component/component";
import Window from "../../components/window";
import Content from "../../components/content";
import {Fn} from "../../modules/functions/functions";
import Button from "../../components/button";
import Alert from "../../components/window/alert";
import FileUpload from "../file-upload";

// Страничка опций открытого чата

export type optionsPropsType = {
	chat?: {
		title?: string,
		avatar?: string,
		avatarText?: string
	},
	callbacks: {
		deleteChat?: Fn<void>,
		avatarChat?: Fn<void, File>
	}
} & ComponentPropsData;

export default class Options extends Window{

	constructor(props: optionsPropsType) {
		// Создаём содержимое окна по шаблону
		const content = new Content({
			template: tpl,
			avatar: props.avatar,
			avatarText: props.avatarText,
			title: props.title,
			destroyable: false
		});
		super(Object.assign(props, {
			className: 'options',
			title: 'Опции диалога',
			controls: {
				close: true
			},
			children: {
				content: [content]  // Передаем содержимое в чилдрены
			}
		}));

		// Привязываем ресет формы при закрытии окна
		this.props.close=this.reset;

		// Добавляем инпут (Не нашёл в API как менять название чата)
		// const inputTitle = new Input({
		// 	type: 'text',
		// 	name: 'title',
		// 	label: 'Название чата:',
		// 	value: props.chat?.title ?? '',
		// 	isStacked: true,
		// 	events: {
		// 		'focusout': () => {
		// 			validate(inputTitle);
		// 		}
		// 	}
		// });
		const buttonAvatar = new Button({
			name: 'avatar',
			type: 'button',
			text: 'Изменить аватар',
			events: {
				'click': () => Alert.alertWindow(
					new FileUpload({callback: props.callbacks.avatarChat}))
			}
		});
		const buttonDelete = new Button({
			name: 'delete',
			type: 'button',
			text: 'Удалить диалог',
			events: {
				'click': deleteChat.bind(this)
			}
		});
		content.children.settings=[buttonAvatar, buttonDelete];

		// Добавляем кнопку закрытия
		const buttonClose = new Button({
			name: 'close',
			type: 'button',
			text: 'Закрыть',
			events: {
				'click': () => {
					this.reset();
					this.close();
				}
			}
		});
		content.children.buttons=[buttonClose];

		// Обновляем контект окна
		this.updateChildren(true);

		function deleteChat():void {
			const callback = (this.props as optionsPropsType).callbacks?.deleteChat;
			if(callback){
				callback();
				this.close();
			}
		}
	}

	protected override _updateProp(prop: string): void {
		if(prop==='chat') {

			// Не нашёл в API как менять название чата
			// const inputTitle = this.children.content[0].children.settings.find(s => {
			// 	return (s instanceof Input && s.props.name==='title');
			// }) as Input;
			// if(inputTitle){
			// 	(inputTitle.target()).value
			// 		= (this.props as optionsPropsType).chat?.title ?? '';
			// }

			const avatarDiv = this.subElement('div.avatar div.avatarImage') as HTMLDivElement;
			avatarDiv.style.backgroundImage
				= `url('${(this.props as optionsPropsType).chat?.avatar ?? ''}')`;
			avatarDiv.textContent = (this.props as optionsPropsType).chat?.avatarText ?? '';

		}
	}

	private reset():void {
		this._updateProp('chat');
	}

}
