import tpl_userlist from './tpl_userlist.hbs';
import tpl_userPreview from './tpl_user_preview.hbs';
import './style.scss';
import BaseComponent, {ComponentPropsData} from "~src/components/components";
import {Fn, generateDom} from "~src/modules/functions";

// Компонент Userlist отвечает за список пользователей

// Тип данных для превью
type userPreviewData = {
	id: string,
	displayName: string,
	avatar: string,
	avatarText: string
}

// Метод рендера HTML-строки превьюшки по шаблону
function userPreview(data: userPreviewData): string {
	return tpl_userPreview(data);
}

// Тип данных для списка пользователей
type userlistData = {
	foundUsers?: object,
	callback?: Fn<void, string>
} & ComponentPropsData;

// Метод рендера HTML-строки чатлиста по шаблону
function userlist(data: userlistData): HTMLElement {
	return generateDom(tpl_userlist(data));
}

// Класс чатлиста
export default class Userlist extends BaseComponent<userlistData> {

	constructor(props: userlistData) {
		// Сначала создаём базовый компонент  и рендерим его
		super(props);
	}

	// Метод рендера DOM-дерева кнопки по шаблону
	protected override render(data: userlistData): HTMLElement {
		return userlist(data);
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
		if (prop === 'users') {
			this.document().innerHTML='';
			if (this.props.users && Object.keys(this.props.users).length > 0) {
				Object.values(this.props.users).forEach((user) => {
					const {id, avatar, avatarText, display_name: displayName} = user;
					const dom = generateDom(userPreview({
						id,
						avatar,
						avatarText,
						displayName
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
