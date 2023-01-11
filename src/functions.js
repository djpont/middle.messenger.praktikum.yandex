

// export const clearDom = (element) => {
// 	element.innerHTML = '';
// }
//
// export const changeDom = (element, dom) => {
// 	clearDom(element);
// 	element.append(dom);
// }

export const joinDom = (...domElements) => {
	const dom = document.createDocumentFragment();
	for(const el of domElements){
		dom.append(el.document());
	}
	return dom;
}

// export const joinHTML = (...elements) => {
// 	return elements.join('');
// }