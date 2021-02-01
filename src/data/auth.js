import firebase from 'firebase';
import { writable } from 'svelte/store';

// TODO: >:( Move this to a better place
import { init } from '.';
init();

export const user = writable(null);
export const isLinked = writable(false);

// TODO: Fill in more
const allowedEmails = [
    'epita.fr',
    'epitech.eu'
];

export function setup()
{
    firebase.auth().onAuthStateChanged(u => {
        if (!u) return;

        user.set(u);
        isLinked.set(u.providerData.length === 2);
    });
}

export function login()
{
    return firebase.auth()
        .signInWithPopup(getAppleProvider())
        .then(result => {
            console.log('>> Auth success');

            user.set(result.user);
            isLinked.set(result.user.providerData.length === 2);
        })
        .catch(error => {
            console.error('>> Auth error');
            console.error(error);
        });
}

export function linkMicrosoft()
{
    const provider = getMicrosoftProvider();
    return firebase.auth()
        .currentUser.linkWithPopup(provider)
        .then(result => {
            console.log('>> MS Auth success');

            const email = result.user.email;
            if (!allowedEmails.find(s => email.endsWith(`@${s}`) || email.endsWith(`.${s}`))) {
                // TODO: Real error modal
                // TODO: and ... ><
                alert("Ce compte Microsoft n'est pas celui d'une école IONIS");
                return firebase.auth().currentUser.unlink(provider.providerId).then(() => false);
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

export function deleteAccount()
{
    return firebase.auth().currentUser.delete().then(clear);
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
