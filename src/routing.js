import page_login from './pages/login/page.js';

export default (route, rootElement) => {
	switch (route){
		case '/login':
			page_login(rootElement);
			break
	}
}