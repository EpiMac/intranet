import firebase from 'firebase/app';
import 'firebase/auth';

import { user, isLinked } from './store';

// TODO: Fill in more
const allowedEmails = [
    'epita.fr',
    'epitech.eu'
];

function init()
{
    firebase
        .initializeApp(require('../../firebase.json'))
        .auth()
        .onAuthStateChanged(u => {
            if (!u) return;

            user.set(u);
            isLinked.set(u.providerData.length === 2);
        });
}

export function login()
{
    return firebase
        .auth()
        .signInWithPopup(getAppleProvider())
        .then(result => {
            console.log('>> Auth success');
            if (!result.user) {
                return false;
            }

            user.set(result.user);
            isLinked.set(result.user.providerData.length === 2);

            return true;
        })
        .catch(error => {
            console.error('>> Auth error');
            console.error(error);
        });
}

export function linkMicrosoft()
{
    const provider = getMicrosoftProvider();

    return firebase
        .auth()
        .currentUser
        .linkWithPopup(provider)
        .then(result => {
            console.log('>> MS Auth success');

            const email = result.user.providerData[1].email;
            if (!allowedEmails.find(s => email.endsWith(`@${s}`) || email.endsWith(`.${s}`))) {
                // TODO: Real error modal
                // TODO: Move to cloud function
                alert("Ce compte Microsoft n'est pas celui d'une école IONIS");

                return firebase
                    .auth()
                    .currentUser
                    .unlink(provider.providerId)
                    .then(() => false);
            }

            isLinked.set(true);
            return true;
        })
        .catch(error => {
            console.error('>> MS auth error');
            console.error(error);
        })
}

export function logout()
{
    return firebase.auth().signOut().then(clear);
}

function clear()
{
    user.set(null);
    isLinked.set(false);
}

function getAppleProvider()
{
    const provider = new firebase.auth.OAuthProvider('apple.com');
    provider.setCustomParameters({ locale: 'fr' });
    provider.addScope('email');
    provider.addScope('name');

    return provider;
}

function getMicrosoftProvider()
{
    return new firebase.auth.OAuthProvider('microsoft.com');
}

init();
