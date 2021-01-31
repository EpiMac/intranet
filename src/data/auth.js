import firebase from 'firebase';

export let user;

export function login()
{
    return firebase.auth()
        .signInWithPopup(getAppleProvider())
        .then((result) => {
            console.log('>> Auth success');
            user = result.user;
        })
        .catch((error) => {
            console.error('>> Auth error');
            console.error(error);
        });
}

function getAppleProvider()
{
    const provider = new firebase.auth.OAuthProvider('apple.com');
    provider.setCustomParameters({ locale: 'fr' });
    provider.addScope('email');
    provider.addScope('name');

    return provider;
}
