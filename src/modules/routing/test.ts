import Routing from "./routing";
import Messenger from "../../pages/messenger";
import page404 from '../../pages/error/404';
import View from "../../components/view";

const PATHS = {
	messenger: '/messenger',
} as const;

const documentBody = document.createElement('div');
const view = new View({rootElement: documentBody});
Routing.setView(view);

const pageError404 = page404();
const pageMessenger = new Messenger({});

Routing.use({
	path: PATHS.messenger,
	window: pageMessenger,
	layer: View.LAYERS.main
});

Routing.set404(Routing.use({
	path: '',
	window: pageError404,
	layer: View.LAYERS.alert
}));

describe('Routing', () => {

	test('Переход на Messenger', async () => {
		view.clear();
		await Routing.go(PATHS.messenger);
		const windowsInView =
			Array.from(documentBody.querySelectorAll(':scope > main *'));
		const isMessengerInView = windowsInView.includes(pageMessenger.document());
		expect(isMessengerInView).toBe(true);
	});

	test('Переход на 404', async () => {
		view.clear();
		await Routing.go('page missing');
		const windowsInView =
			Array.from(documentBody.querySelectorAll(':scope > main *'));
		const is404InView = windowsInView.includes(pageError404.document());
		expect(is404InView).toBe(true);
	});
});
