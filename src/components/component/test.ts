import BaseComponent, {ComponentPropsData} from "./component";
import {generateDom} from "../../modules/functions/functions";

type testComponentData = {
	text?: string,
	className?: string
} & ComponentPropsData;

const testComponent = (data: testComponentData): string => {
	const {text, className} = data;
	return `<div class="${className}">${text}</div>`;
};

class TestComponent extends BaseComponent<testComponentData> {

	constructor(props: testComponentData) {
		super(props);
	}

	protected override render(data: testComponentData): HTMLElement {
		return generateDom(testComponent(data));
	}
}

describe('Component', () => {

	test('Компонент должен корректно рендерится', () => {
		const test = new TestComponent({
			text: 'alfa',
			className: 'betta'
		});
		const dom = test.document();
		expect(dom.innerHTML.trim()).toBe('alfa');
		expect(dom.className.trim()).toBe('betta');
	});

	test('Компонент должен отрабатывать события', () => {
		let testVar: string = "untested";
		const test = new TestComponent({
			text: 'alfa',
			className: 'betta',
			events: {
				'click': () => {
					testVar = "test ok";
				}
			}
		});
		test.document().click();
		expect(testVar).toBe("test ok");
	});

});
