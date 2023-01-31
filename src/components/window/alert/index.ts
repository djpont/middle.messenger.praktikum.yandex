import tpl from './tpl.hbs';
import "./style.scss";
import View from "~src/components/view";
import Window from "~src/components/window";
import Content from "~src/components/content";
import Button from "~src/components/button";

// Компонент Alert отвечает за рендер окон с сообщениями.
// Отличия от других компонентов: Данный компонент не является наследником базового Компонента.
// По сути он является связущим звеном между view и window,
// вынесен в отдельный компонент, чтобы не создавать взаимосвязь между view и window

// Тип данных для алерта
type alertData = {
	rootElement: View
}

// Тип для указания типа алерта
enum alertType {
	message,	// Сообщение с возможностью закрыть
	error,		// Ошибка с возможностью закрыть
	fatal,		// Ошибка без возможности закрыть
}

// Класс алерта
export default class Alert {

	// Детаем типы алертов публичными
	public static readonly TYPE = alertType;

	// Приватно сохраняем вью, в котором будем рендерить окна с сообщениями
	private readonly _view: View;

	constructor(data: alertData) {
		this._view = data.rootElement;
	}

	// Метод отобржения сообщения в заренее указанном view
	public message(text: string[]): void {
		this._showAlertWindow(alertType.message, 'Сообщение', text);
	}

	// Метод отобржения ошибки в заренее указанном view
	public error(text: string[]): void {
		this._showAlertWindow(alertType.error, 'Ошибка', text);
	}

	// Метод отобржения критической ошибки в заренее указанном view
	public fatal(text: string[]): void {
		text.push('<br>Выполнение программы не может быть продолжено.')
		this._showAlertWindow(alertType.fatal, 'Критическая ошибка', text);
	}

	// Метод рендера окна с сообщением или ошибкой
	private _showAlertWindow(type:alertType, title:string, text:string[]){
		let className = 'alert' // Стандартный класс
		const controls = {close: true}	// Стандартный список кнопок контроля окна в шапке

		// Меняем, если тип = ошибка или фатальная ошибка
		if(type === alertType.error) {
			className+=' error';
		}else if(type === alertType.fatal){
			className+=' error fatal';
			controls.close=false;
		}

		// Создаём содержимое окна по шаблону
		const content = new Content({
			template: tpl,
			text
		});

		// Создаём окно с созданным выше содержимым
		const window = new Window({
			title,
			className,
			controls,
			children: {
				content: [content]
			}
		});

		// Если сообщение или ошибка (не фатальная), то добаляем кнопку закрытия
		if(type === alertType.message || type === alertType.error){
			const button = new Button({
				text:'Закрыть'
			});
			content.children.buttons=[button];
			// При нажатии кнопка вызывает метод close() у window
			button.eventBus.on(Button.EVENTS.click, window.close);
		}

		// Добавляем окно в view
		this._view.children.alert.push(window);
		// Обновляем чилдренов view (без рекурсии)
		this._view.updateChildren();
		// Обновляем чилдренов окна (без рекурсии)
		window.updateChildren(true);
	}

	// Метод отобожения переданного окна на слой alert.
	// На случай, если окно не является сообщением, например file upload
	public alertWindow(window: Window){
		this._view.children.alert.push(window);
		this._view.updateChildren();
	}
}
