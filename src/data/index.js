import firebase from 'firebase';

import 'firebase/auth';
import 'firebase/database';

let app;

export function init() {
    app = firebase.initializeApp(require('../../firebase.json'));
}
