import View from "../../components/view";
import Window from "../../components/window";

// Роутинг

type checkFunctionType = (nextPath: string) => Promise<string>;

type routeType = {
	path: string,
	// page: routeFnType;
	window: Window | typeof Window,
	layer: string,
	checkFunction?: checkFunctionType
}

// Дефолтная функция проверки роута, всегда успеша
function checkNextRouteDefaultFunction(nextPath: string): Promise<string>{
	return new Promise((resolve) => {
		resolve(nextPath);
	})
}

// Класс роута - одного пути для роутинга
class Route{
	private readonly _path: string; // путь
	private readonly _window: Window | typeof Window; // Вызываемая страничка
	private readonly _layer: string; // слой для вью, куда показывать страничку
	private _checkNextRouteFunction: checkFunctionType; // функция проверки доступности роута

	constructor(data: routeType) {
		const {path, window, layer} = data;
		this._path=path;
		this._window=window;
		this._layer=layer;
		this._checkNextRouteFunction = data.checkFunction || checkNextRouteDefaultFunction;
	}

	// Метод проверки валидности роута
	public beforeRoute(): Promise<Route> {
		return new Promise((resolve) => {
			const urlPath=this.getData().path;
			this._checkNextRouteFunction(urlPath)
				.then((urlPathChecked: string) => {
					if(urlPathChecked===urlPath){
						resolve(this);
					}else{
						resolve(Routing.getRoute(urlPathChecked));
					}
				});
		})
	}

	public getData(): {
		path: string;
		window: Window | typeof Window;
		layer: string
	}{
		return{
			path: this._path,
			window: this._window,
			layer: this._layer,
		}
	}
}

// Класс процесса роутинга
export default class Routing {
	private static _view: View;
	private static _routes: Route[] = [];
	private static _404: Route;

	// Установка вью - куда показываем страницы
	public static setView(rootElement: View): void {
		Routing._view = rootElement;
	}

	// Страница, которую показываем, если роут не найден
	public static set404(route: Route): void {
		Routing._404=route;
	}

	// Получаем текущий вью
	private static getView(): View {
		if (!Routing._view) {
			throw new Error('Не установлен _view для Routing');
		}
		return Routing._view;
	}

	// Регистрация страницы в роутере
	public static use(data: routeType): Route{
		const route = new Route(data);
		this._routes.push(route);
		return route;
	}

	// Переход на сраницу по url
	public static async go(urlPath:string): Promise<void>{
		const route = Routing.getRoute(urlPath);
		await route.beforeRoute()
			.then((route: Route) => {
				const view = Routing.getView();
				const {path, window, layer} = route.getData();
				// Если роут на main слой, то очищаем вью и добавляем путь в историю
				if(layer===View.LAYERS.main){
					view.clear();
					if (document.location.pathname !== path) {
						history.pushState(null, '', path);
					}
				}
				if(window instanceof Window){
					view.children[layer].push(window);
				}else{
					view.children[layer].push(new window({}));
				}
				view.updateChildren();
			})
	}

	// Получаем роут по url
	public static getRoute(urlPath: string): Route {
		// Сначала ищем роут по urlPath
		let route = Routing._routes.find(route => route.getData().path===urlPath);
		// Если не нашли - перенаправляем на 404
		if(route===undefined){
			if(Routing._404){
				route=Routing._404;
			}else{
				throw new Error('Не указан роут ошибки 404');
			}
		}
		return route;
	}
}
