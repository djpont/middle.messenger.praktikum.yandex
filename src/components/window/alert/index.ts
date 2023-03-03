import tpl from './tpl.hbs';
import "./style.scss";
import View from "../../view";
import Window from "../index";
import Content from "../../content";
import Button from "../../button";

// Компонент Alert отвечает за рендер окон с сообщениями.
// Отличия от других компонентов: Данный компонент не является наследником базового Компонента.
// По сути он является связущим звеном между view и window,
// вынесен в отдельный компонент, чтобы не создавать взаимосвязь между view и window

// Тип для указания типа алерта
enum alertType {
	message,	// Сообщение с возможностью закрыть
	error,		// Ошибка с возможностью закрыть
	fatal,		// Ошибка без возможности закрыть
}

// Класс алерта
export default class Alert {

	// Приватно сохраняем вью, в котором будем рендерить окна с сообщениями
	private static _view: View;

	// Детаем типы алертов публичными
	public static readonly TYPE = alertType;

	public static setView(view: View): void {
		Alert._view = view;
	}

	// Получаем последний использованный view для инпользования внутри компонентов
	private static getView(): View {
		if (!Alert._view) {
			throw new Error('Не установлен _view для Alert');
		}
		return Alert._view;
	}

	// Метод отобржения сообщения в заренее указанном view
	public static message(text: string[], render: boolean = true): Window {
		const window = Alert.generateAlertWindow(alertType.message, 'Сообщение', text);
		if(render){
			Alert.showGeneratedAlertWindow(window);
		}
		return window;
	}

	// Метод отобржения ошибки в заренее указанном view
	public static error(text: string[], render: boolean = true): Window {
		const window = Alert.generateAlertWindow(alertType.error, 'Ошибка', text);
		if(render){
			Alert.showGeneratedAlertWindow(window);
		}
		return window;
	}

	// Метод отобржения критической ошибки в заренее указанном view
	public static fatal(text: string[], render: boolean = true): Window {
		text.push('<br>Выполнение программы не может быть продолжено.')
		const window = Alert.generateAlertWindow(alertType.fatal, 'Критическая ошибка', text);
		if(render){
			Alert.showGeneratedAlertWindow(window);
		}
		return window;
	}

	// Метод добавления сгенерированного окна на view
	private static showGeneratedAlertWindow(window: Window): void{
		// Добавляем окно в view
		Alert.getView().children[View.LAYERS.alert].push(window);
		// Обновляем чилдренов view (без рекурсии)
		Alert.getView().updateChildren();
		// Фокус на кнопку
		window.focusOnFocusElement();
	}

	// Метод генерации окна с сообщением или ошибкой
	private static generateAlertWindow(type:alertType, title:string, text:string[]): Window{
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
		let button: Button | null = null;
		if(type === alertType.message || type === alertType.error){
			button = new Button({
				text:'Закрыть',
				events:{
					// При нажатии кнопка вызывает метод close() у window
					'click': window.close
				}
			});
			content.children.buttons=[button];
		}

		// Добавляем кнопку в пропсы для фокуса
		if(button) {
			window.props.focusElement = button;
		}

		// Обновляем чилдренов окна (с рекурсией)
		window.updateChildren(true);

		return window;
	}

	// Метод отобожения переданного окна на слой alert.
	// На случай, если окно не является сообщением, например file upload
	public static alertWindow(window: Window){
		const view=Alert.getView();
		view.children[View.LAYERS.alert].push(window);
		view.updateChildren();
	}

	// Метод проверки, есть ли открытые окна с сообщениями
	public static isEmpty():boolean{
		const view=Alert.getView();
		return view.children[View.LAYERS.alert].length===0;
	}
}
