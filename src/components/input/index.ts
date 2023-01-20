import tpl_full from './tpl_full.hbs';
import tpl_only_input from './tpl_only_input.hbs';
import './style.scss';

type inputData = {
	id?:string,
	type?:string,
	name?:string,
	value?:string
}

export const input = (data:inputData) => {
	const { id='', type='text', name='', value='' } = data;
	return tpl_only_input({ id, type, name, value });
};

export const inputWithLabel = ({id, type='text', name='', value='', label='', isStacked=false}) => {
	return tpl_full({ id, type, name, value, label, isStacked });
};
