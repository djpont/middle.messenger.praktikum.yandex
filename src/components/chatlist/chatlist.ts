import tpl_chatlist from './tpl_chatlist.hbs';
import tpl_chatPreview from './tpl_chat_preview.hbs';
import './style.scss';
import BaseComponent, {ComponentPropsData} from "../component/component";
import {generateDom} from "../../modules/functions/functions";


// Компонент Chatlist отвечает за список чатов
// Состоит из превью чата и списка превьюшек

// Тип данных для превью
type chatPreviewData = {
	id: string
	title: string,
	avatar: string,
	avatarText: string,
	lastMessage: object,
	unreadCount: string
}

// Метод рендера HTML-строки превьюшки по шаблону
function chatPreview(data: chatPreviewData): string {
	if(data.lastMessage && Object.keys(data.lastMessage).length===0){
		data.lastMessage={text:'Диалог пуст'};
	}
	return tpl_chatPreview(data);
}

// Тип данных для чатлиста
type chatlistData = {
	chats?: object,
	callback?: (id: string) => void
} & ComponentPropsData;

// Метод рендера HTML-строки чатлиста по шаблону
const chatlist = (): HTMLElement => {
	// Сначала создаём DOM-дерево по шаблону
	return generateDom(tpl_chatlist());
}

// Класс чатлиста
export default class Chatlist extends BaseComponent<chatlistData> {

	constructor(props: chatlistData) {
		// Сначала создаём базовый компонент  и рендерим его
		super(props);
	}

	// Метод рендера DOM-дерева кнопки по шаблону
	protected override render(): HTMLElement {
		return chatlist();
	}

	// Метод получения пропса из DOM-дерева
	protected override getProp(): { fromDom: boolean; value: unknown } {
		const result = {
			fromDom: false,
			value: ''
		}
		return result;
	}

	// Метод обновления DOM-дерева после обновления пропса (пока таких нет)
	protected override _updateProp(prop: string): void {
		if (prop === 'chats') {
			this.document().innerHTML = '';
			if (this.props.chats && Object.keys(this.props.chats).length > 0) {
				Object.values(this.props.chats).forEach((chat) => {
					const {
						id,
						avatar,
						avatarText = '',
						title,
						last_message: lastMessage,
						unread_count: unreadCount
					} = chat;
					const dom = generateDom(chatPreview({
						id,
						avatar,
						avatarText,
						title,
						lastMessage,
						unreadCount
					}));
					dom.onclick = () => {
						this.props.callback?.(id);
					}
					this.document().append(dom);
				});
			}
		}
		return;
	}
}
