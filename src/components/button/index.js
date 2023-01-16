import tpl from './tpl.hbs';

export const button = (id, value) => {
	return tpl({ id, value });
};