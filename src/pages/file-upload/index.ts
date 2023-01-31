import tpl from './tpl.hbs';
import './style.scss';
import Window from "~src/components/window";
import Content from "~src/components/content";

export default (): Window => {

	// Создаём содержимое окна по шаблону
	const content = new Content({template: tpl});

	// Создаём окно с созданным выше содержимым
	const window = new Window({
		className: 'fileUpload',
		title: 'Загрузка файла',
		controls: {
			close: true
		},
		children: {
			content: [content]  // Передаем содержимое в чилдрены
		}
	});

	// Вызываем обновление чилдренов окна, в аргументах true - для рекурсии, чтобы вложенные
	// дочерние элементы тоже обновились
	window.updateChildren(true);

	return window;
}
