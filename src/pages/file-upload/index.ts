import tpl from './tpl.hbs';
import './style.scss';
import Window from "../../components/window";
import Content from "../../components/content";
import {Fn} from "../../modules/functions";
import Button from "../../components/button";
import {ComponentPropsData} from "../../components/components";

// Страничка загрузки файла. Возвращает окно.

export default class FileUpload extends Window {

	constructor(data: {callback?: Fn<void, File>} & ComponentPropsData = {}) {
		// Создаём содержимое окна по шаблону
		const content = new Content({template: tpl});

		// Создаём окно с созданным выше содержимым
		super({
			className: 'fileUpload',
			title: 'Загрузка файла',
			controls: {
				close: true
			},
			children: {
				content: [content]  // Передаем содержимое в чилдрены
			}
		});

		if(data.callback){
			this.props.callback = data.callback;
		}

		// Задаем кнопке и инпуту каллбек
		const fileElement = content.subElement("input[type='file']") as HTMLInputElement;
		fileElement.addEventListener('change', async () => {
			if (fileElement.files) {
				const file = fileElement.files[0];
				if (this.props.callback) {
					(await this.props.callback as Fn<void, File>)(file);
				}
				this.close();
			}
		})
		const button = Button.makeButton(content.subElement("button"));
		button.props.events = {
			'click': () => {
				fileElement.click();
			}
		}


		// Вызываем обновление чилдренов окна, в аргументах true - для рекурсии, чтобы вложенные
		// дочерние элементы тоже обновились
		this.updateChildren(true);

		// Вызываем нажатие на инпут файла (в некоторых браузерах сработает)
		fileElement.click();

	}
}
