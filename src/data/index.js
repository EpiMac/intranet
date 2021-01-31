import firebase from 'firebase';

import 'firebase/auth';

// TODO: Replace with single 'auth' file or folder
let app;

export function init() {
    app = firebase.initializeApp(require('../../firebase.json'));
}
