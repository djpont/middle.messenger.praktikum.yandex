import tpl from './tpl.hbs';
import Window from "~src/components/window";
import {generateDom} from "~src/components/components";
import './style.scss';

export default (rootElement: HTMLElement) => {
    const page: Window = new Window({
            id: 'file-upload',
            className: 'file-upload',
            title: 'Загрузка файла',
            controls: {
                close: true
            }
        })
    ;
    rootElement.append(page.document());

    const document: HTMLElement = generateDom(tpl({}));
    page.content().append(document);

}
