// import {joinDom} from '/src/functions';
import Window from "/src/components/window";
import Field from "/src/components/field";
import Button, {button} from '/src/components/button';
import Input from "/src/components/input";
import Infostring, {infostring} from "/src/components/infostring";
import Avatar, {avatar} from "/src/components/avatar";
import {joinHTML} from "../../functions";
import {generateDom} from "../../components/components";

export default (rootElement, user) => {
	const page = new Window(
		'file-upload',
		'',
		'Загрузка файла'
	);
	
	const input_upload = new Input('file', 'file', 'Файл:');
	const button_upload = new Button('submit', 'Загрузить файл');
	
	const inputs_block = new Field([input_upload]);
	const buttons_block = new Field([button_upload]);
	
	rootElement.append(page.document());
	page.content().append(inputs_block, buttons_block);
}