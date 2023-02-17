import View from "~src/components/view";
import Window from "~src/components/window";
// import {Fn} from "~src/modules/functions";

// Роутинг

// type routeFnType = Fn<Window> | Window;
type checkFunctionType = (nextRoute: Route) => Promise<Route>;

type routeType = {
	path: string,
	// page: routeFnType;
	window: Window | typeof Window,
	layer: string,
	checkFunction?: checkFunctionType
}

// Дефолтная функция проверки роута, всегда успеша
function checkNextRouteDefaultFunction(nextRoute: Route): Promise<Route>{
	return new Promise((resolve) => {
		resolve(nextRoute);
	})
}

// Класс роута - одного пути для роутинга
export class Route{
	private _path: string; // путь
	// private _page: routeFnType; // вызываемая страничка
	private _window: Window | typeof Window;
	private _layer: string; // слой для вью, куда показывать страничку
	private _checkNextRouteFunction: checkFunctionType; // функция проверки доступности роута

	constructor(data: routeType) {
		const {path, window, layer} = data;
		this._path=path;
		// this._page=page;
		this._window=window;
		this._layer=layer;
		this._checkNextRouteFunction = data.checkFunction || checkNextRouteDefaultFunction;
	}

	public beforeRoute(): Promise<Route> {
		return this._checkNextRouteFunction(this);
	}

	public getData(): {
		path: string;
		// page: routeFnType;
		window: Window | typeof Window;
		layer: string
	}{
		return{
			path: this._path,
			// page: this._page,
			window: this._window,
			layer: this._layer,
		}
	}
}

export default class Routing {
	private static _view: View;
	private static _routes: Route[] = [];
	private static _404: Route;

	public static setView(rootElement: View): void {
		Routing._view = rootElement;
	}

	public static set404(route: Route): void {
		Routing._404=route;
	}

	private static getView(): View {
		if (!Routing._view) {
			throw new Error('Не установлен _view для Routing');
		}
		return Routing._view;
	}

	public static use(data: routeType): Route{
		const route = new Route(data);
		this._routes.push(route);
		return route;
	}

	public static go(urlPath:string): void{
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
		route.beforeRoute()
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
				// view.children[layer].push(page());
				if(window instanceof Window){
					view.children[layer].push(window);
				}else{
					view.children[layer].push(new window({}));
				}
				view.updateChildren();
			});
	}
}
