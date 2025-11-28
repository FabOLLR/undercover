import { Router } from './router.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    window.ui = new UI();
    window.router = new Router();
    window.router.init();
});
