// src/index.js

import {sum} from './modules/sum';

const root = document.querySelector('#root');
root.textContent = sum(17, -1).toString();