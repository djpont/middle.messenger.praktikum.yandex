import {generateDom, isEqual} from "./functions";


describe('Functions', () => {

	test('generateDom должен превратить строку в dom-дуруво',  () => {
		const htmlCode = `<div class='first'><span class='second'></span></div>`;
		const dom = generateDom(htmlCode);
		expect(dom.outerHTML).toBe(`<div class="first"><span class="second"></span></div>`);
		expect(dom.className).toBe('first');
		const span = dom.firstChild as HTMLSpanElement;
		expect(span.className).toBe('second');
	});

	test('isEqual должен корректно сравнивать два объекта', () => {
		const obj1 = {a:{b:{c:[1,2,3],d:[4,5,6]}}};
		const obj2 = {a:{b:{c:[1,2,3],d:[4,5,6]}}};
		const obj3 = {a:{b:{c:[1,2,3],d:[4,5,6,7]}}};
		expect(isEqual(obj1,obj2)).toBe(true);
		expect(isEqual(obj1,obj3)).toBe(false);
	});
});
