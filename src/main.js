import 'tailwindcss/base.css';
import 'tailwindcss/utilities.css';

import './fonts.scss';
import './styles.scss';

import { init } from './data';
import App from './App.svelte';

init();

export default new App({
    target: document.body
});
