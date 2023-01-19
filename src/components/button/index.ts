import tpl from "./tpl.hbs";

export const button = ({id, name, type, value}) => {
	return tpl({ id, name, type, value });
};
