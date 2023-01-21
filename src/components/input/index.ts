import tpl_full from './tpl_full.hbs';
import tpl_only_input from './tpl_only_input.hbs';
// import './style.scss';

type inputData = {
	id?: string,
	type?: string,
	name?: string,
	value?: string,
}

type inputDataWithLabel = {
	label?: string,
	isStacked?: boolean
} & inputData;

export const input = (data: inputData): string => {
	const {
		id = '',
		type = 'text',
		name = '',
		value = ''
	} = data;
	return tpl_only_input({id, type, name, value});
};

export const inputWithLabel = (data: inputDataWithLabel): string => {
	const {
		id = '',
		type = 'text',
		name = '',
		value = '',
		label = '',
		isStacked = false
	} = data;
	return tpl_full({id, type, name, value, label, isStacked});
};
