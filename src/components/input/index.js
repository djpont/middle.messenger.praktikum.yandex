import tpl_full from './tpl_full.hbs';
import tpl_only_input from './tpl_only_input.hbs';
import './style.scss';

export const input = (id, type='text', value='') => {
	return tpl_only_input({ id, type, value });
};

export const inputWithLabel = (id, type='text', value='', label='', isStacked=false) => {
	return tpl_full({ id, type, value, label, isStacked });
};
