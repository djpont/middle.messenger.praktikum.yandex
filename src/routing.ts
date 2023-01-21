import page_sign_in from './pages/sign-in';
import page_sign_up from './pages/sign-up';
import page_404 from './pages/error/404';
import page_500 from './pages/error/500';
import messenger from "./pages/messenger";
import profile from "./pages/profile";
import file_upload from "./pages/file-upload";

export default (route: string, rootElement: HTMLElement): void => {
	const pages = {
		'/sign-in': page_sign_in,
		'/sign-up': page_sign_up,
		'/404': page_404,
		'/500': page_500,
		'/messenger': messenger,
		'/profile': profile,
		'/file-upload': file_upload
	}

	if (Object.keys(pages).includes(route)) {
		const routeVoid = Object.entries(pages).find(([thisRoute]) => thisRoute === route);
		if (routeVoid === undefined) {
			throw new Error(`Роут ${route} не найден`);
		}
		routeVoid[1](rootElement);
	} else {
		page_404(rootElement);
	}
}
