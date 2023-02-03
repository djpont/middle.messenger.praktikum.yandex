import pageSignIn from '../pages/sign-in';
import pageSignUp from '../pages/sign-up';
import page404 from '../pages/error/404'; // тут нужно вызывать обычный Window с рабочей кнопкой
import page500 from '../pages/error/500'; // , а содержимое по своему шаблону генерировать
import messenger from "../pages/messenger";
import profile from "../pages/profile";
import fileUpload from "../pages/file-upload";
import View from "~src/components/view";
import Window from "~src/components/window";

// Роутинг
export default (route: string, rootElement: View):void => {

	// Очистка корневого элемента
	rootElement.clear();

	// Для роутинга. Если адрес отличается от роута, то вставляем его в историю браузера
	if(document.location.pathname!==route){
		history.pushState(null, '', route);
	}

	// Возможные направления роутинга
	const pages = {
		'/sign-in': pageSignIn,
		'/sign-up': pageSignUp,
		'/404': page404,
		'/500': page500,
		'/messenger': messenger,
		'/profile': profile,
		'/file-upload': fileUpload
	}

	// Роутинг, а если не нашёл - ошибка 404
	if (Object.keys(pages).includes(route)) {
		const routeVoid = Object.entries(pages).find(([thisRoute]) => thisRoute === route);
		if (routeVoid === undefined) {
			throw new Error(`Роут ${route} не найден`);
		}
		const routeResult = routeVoid[1](rootElement);
		// Есть страница вернула окно, то добавляем его во view, иначе ничего не делаем, т.к. если
		// роутинг был методом void, то он сам должен позаботиться о рендере окон
		if (routeResult instanceof Window){
			rootElement.children.main=[routeResult];
			rootElement.updateChildren();
		}
	} else {
		page404(rootElement);
	}
}
