

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

export const joinHTML = (elements, addParentDiv=false) => {
	let html= elements.join('');
	if(addParentDiv){
		html=`<div>${html}</div>`;
	}
	return html;
}