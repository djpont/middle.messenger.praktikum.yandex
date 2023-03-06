import View from "../../components/view";
import Messenger from "../../pages/messenger";

const documentBody = document.createElement('div');
const view = new View({rootElement: documentBody});

const messenger = new Messenger({});
const messenger2 = new Messenger({});
const messenger3 = new Messenger({});

test('View: при запуске View пуст',  () => {
	const mainWindowsInView =
		Array.from(documentBody.querySelectorAll(':scope > main > div.mainWindows > *'));
	const secondWindowsInView =
		Array.from(documentBody.querySelectorAll(':scope > main > div.mainSecond > *'));
	const alertWindowsInView =
		Array.from(documentBody.querySelectorAll(':scope > main > div.mainAlert > *'));
	const countWindowsInView =
		mainWindowsInView.length + secondWindowsInView.length + alertWindowsInView.length;
	expect(countWindowsInView).toBe(0);
});

test('View: добавление окна в main',  () => {
	view.children['main'].push(messenger);
	view.updateChildren();
	const windowsInView =
		Array.from(documentBody.querySelectorAll(':scope > main > div.mainWindows > *'));
	const messengerInView = windowsInView.includes(messenger.document());
	expect(messengerInView).toBe(true);
});

test('View: добавление окна в second',  () => {
	view.children['second'].push(messenger);
	view.updateChildren();
	const windowsInView =
		Array.from(documentBody.querySelectorAll(':scope > main > div.secondWindows > *'));
	const messengerInView = windowsInView.includes(messenger.document());
	expect(messengerInView).toBe(true);
});

test('View: добавление окна в alert',  () => {
	view.children['alert'].push(messenger);
	view.updateChildren();
	const windowsInView =
		Array.from(documentBody.querySelectorAll(':scope > main > div.alertWindows > *'));
	const messengerInView = windowsInView.includes(messenger.document());
	expect(messengerInView).toBe(true);
});

test('View: очистка',  () => {
	view.children['main'].push(messenger);
	view.children['second'].push(messenger2);
	view.children['alert'].push(messenger3);
	view.updateChildren();
	view.clear();
	view.updateChildren();
	const windowsInView =
		Array.from(documentBody.querySelectorAll(
			':scope *'
		));
	const messengerInViewMain = windowsInView.includes(messenger.document());
	const messengerInViewSecond = windowsInView.includes(messenger2.document());
	const messengerInViewAlert = windowsInView.includes(messenger3.document());
	const AnyMessengerInView = messengerInViewMain || messengerInViewSecond || messengerInViewAlert;
	expect(AnyMessengerInView).toBe(false)
});
