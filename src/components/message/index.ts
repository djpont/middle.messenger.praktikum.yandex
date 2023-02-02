import tpl from "./tpl.hbs";
import './style.scss';
import Component from "~src/components/components";
import {generateDom} from "~src/functions";
import {messageData} from "~src/modules/message";
import User from "~src/modules/user";

const message = (data: messageData): string => {
	const {
		user,
		time,
		text
	} = data;
	const nickname: string = user.data().nickname;
	const className: string = (user === User.getMyUser()) ? 'out' : 'in';
	return tpl({className, nickname, time, text});
};

export default class Message extends Component<messageData>{

	constructor(props: messageData) {
		super(props);
	}

	protected override render(data: messageData):HTMLElement{
		return generateDom(message(data));
	}

	protected override updateProp(prop: string): void {
		let element: HTMLElement | null = null;
		const value = this.props[prop];
		switch (prop) {
			case 'text':
				element = this.target();
				break;
		}
		if (element) {
			element.textContent = value;
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
