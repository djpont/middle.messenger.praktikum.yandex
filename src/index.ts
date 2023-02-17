import View from "~src/components/view";
import Alert from "~src/components/window/alert";
import Api from "~src/modules/api";
import Routing from "~src/modules/routing";

import PageSignIn from '~src/pages/sign-in';
import PageSignUp from '~src/pages/sign-up';
import page404 from '~src/pages/error/404';
import page500 from '~src/pages/error/500';
import Messenger from "~src/pages/messenger";
import Profile from "~src/pages/profile";
import Options from "~src/pages/options";
import FileUpload from "~src/pages/file-upload";

// Фиксируем возможные пути для роутинга
export const PATHS = {
	signIn: '/',
	signUp: '/sign-up',
	error404: '/404',
	error500: '/500',
	messenger: '/messenger',
	profile: '/profile',
	options: '/options',
	fileUpload: '/file-upload'
} as const;

// Создаём конревой элемент и применяем его в классы роутинга и алерта
const view = new View({rootElement: document.body});
Routing.setView(view);
Alert.setView(view);
// Страница входа
Routing.use({
	path: PATHS.signIn,
	window: PageSignIn,
	layer: View.LAYERS.main,
	checkFunction: checkIfAlreadyAutorized
});
// Страница мессенджера
Routing.use({
	path: PATHS.messenger,
	window: new Messenger({
		callbacks: {
			optionsCallback: () => Routing.go(PATHS.options),
			detailsCallback: () => Routing.go(PATHS.profile),
			logoutCallback: () => Routing.go(PATHS.signIn)
		}
	}),
	layer: View.LAYERS.main,
	checkFunction: checkIfNeedAutorize
});
// Страница регистрации
Routing.use({
	path: PATHS.signUp,
	window: PageSignUp,
	layer: View.LAYERS.main,
	checkFunction: checkIfAlreadyAutorized
});
// Страница 404 (слой сообщений)
Routing.set404(Routing.use({
	path: PATHS.error404,
	window: page404(),
	layer: View.LAYERS.alert
}));
// Страница профиля (слой второй)
Routing.use({
	path: PATHS.profile,
	window: new Profile({}),
	layer: View.LAYERS.second,
	checkFunction: checkIfNeedAutorize
});
// Страница опций чата (слой второй)
Routing.use({
	path: PATHS.options,
	window: new Options({
		callbacks: {
			deleteChat: Api.deleteChat,
			avatarChat: Api.changeChatAvatar
		}
	}),
	layer: View.LAYERS.second,
	checkFunction: checkIfNeedAutorize
});
// Страница загрузки файла (слой второй)
Routing.use({
	path: PATHS.fileUpload,
	window: FileUpload,
	layer: View.LAYERS.second,
	checkFunction: checkIfNeedAutorize
});
// Страница 500 (слой сообщений)
Routing.use({
	path: PATHS.error500,
	window: page500(),
	layer: View.LAYERS.alert
});
// Запускаем Роутинг
Routing.go(document.location.pathname);

// При нажатии на кноки назад или вперед снова вызываем роутинг
window.addEventListener('popstate', () => {
	Routing.go(document.location.pathname);
});

// Функция проверки доступа - если неавторизован, то перенаправляет на страничку авторизации
async function checkIfNeedAutorize(nextPath: string): Promise<string> {
	return new Promise((resolve) => {
		Api.isAuthorized()
			.then(() => {
				resolve(nextPath) // Если авторизован - пускаем
			})
			.catch(() => {
				resolve(PATHS.signIn) // Если нет - редирект
			});
	});
}

// Функция проверки доступа - если авторизован, то перенаправляет на мессенджер
async function checkIfAlreadyAutorized(nextPath: string): Promise<string> {
	return new Promise((resolve) => {
		Api.isAuthorized()
			.then(() => {
				resolve(PATHS.messenger) // Если авторизован - редирект
			})
			.catch(() => {
				resolve(nextPath) // Если нет - пускаем
			});
	});
}
