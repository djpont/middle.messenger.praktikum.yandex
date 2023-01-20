import tpl from "./tpl.hbs";

type buttonData = {
	id?:string,
	name?:string,
	type?:string,
	value?:string
}

export const button = (data:buttonData) => {
	const { id='', name='', type='',  value='' } = data;
	return tpl({ id, name, type, value });
};
