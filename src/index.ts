import View from "./components/view";
import Alert from "./components/window/alert";
import Api from "./modules/api";
import Routing from "./modules/routing/routing";

import PageSignIn from './pages/sign-in';
import PageSignUp from './pages/sign-up';
import page404 from './pages/error/404';
import page500 from './pages/error/500';
import Messenger from "./pages/messenger";
import Profile from "./pages/profile";
import Options from "./pages/options";
import FileUpload from "./pages/file-upload";

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
	checkFunction: checkIfAlreadyAuthorized
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
	checkFunction: checkIfNeedAuthorize
});
// Страница регистрации
Routing.use({
	path: PATHS.signUp,
	window: PageSignUp,
	layer: View.LAYERS.main,
	checkFunction: checkIfAlreadyAuthorized
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
	checkFunction: checkIfNeedAuthorize
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
	checkFunction: checkIfNeedAuthorize
});
// Страница загрузки файла (слой второй)
Routing.use({
	path: PATHS.fileUpload,
	window: FileUpload,
	layer: View.LAYERS.second,
	checkFunction: checkIfNeedAuthorize
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
async function checkIfNeedAuthorize(nextPath: string): Promise<string> {
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
async function checkIfAlreadyAuthorized(nextPath: string): Promise<string> {
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
