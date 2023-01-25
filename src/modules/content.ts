import {Component} from "~src/components/components";
import {generateDom} from "~src/functions";

type contentType = {
	template: (...args: any) => string,
	data?: unknown,
	children?: childrenType
}

type childrenType = Record<string, Component[]>;

export default class Content extends Component {

	private _children: childrenType = {};

	constructor(contentData: contentType) {
		const {template, data = {}, children = {}} = contentData;
		const html: HTMLElement = generateDom(template(data));
		super(html);
		this.addChildren(children);
	}

	public addChildren = (childData: childrenType): void => {
		Object.entries(childData).forEach(([holder,children]) => {
			children.forEach(child => {
				if(this._children[holder]===undefined){
					this._children[holder]=[];
				}
				this._children[holder].push(child);
			});
		});
		this._updateContentChildren();
	}

	private _updateContentChildren = ():void => {
		Object.entries(this._children).forEach(([holder,children]) => {
			children.forEach(child => {
				const holderElement: HTMLElement = this.subElement(`[data-holder="${holder}"]`);
				holderElement.append(child.document());
			});
		});
	}

}
