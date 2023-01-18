
// Функция объединения дом элементов в единый фрагмент
export const joinDom = (...domElements) => {
	const dom = document.createDocumentFragment();
	for(const el of domElements){
		dom.append(el.document());
	}
	return dom;
}

// Функция объединения html кода в одну строку
export const joinHTML = (elements, addParentDiv=false) => {
	let html= elements.join('');
	if(addParentDiv){
		html=`<div>${html}</div>`;
	}
	return html;
}
