import { loadConfig } from '$lib/server/config';
import { getUserByMicrosoftEmail, updateUser } from '$lib/server/db';
import { updateSession } from '$lib/server/session';
import { ConfidentialClientApplication } from '@azure/msal-node';

const config = loadConfig('microsoft');
const domains = loadConfig('ionis_domains');
const app = new ConfidentialClientApplication({
    auth: {
        clientId: config.client_id,
        clientSecret: config.client_secret,
        authority: `https://login.microsoftonline.com/${config.tenant}`
    }
});

export function getMicrosoftURL()
{
    return app.getAuthCodeUrl({
        scopes: ['user.read'],
        redirectUri: config.redirect_uri
    });
}

// TODO: Handle errors properly
export async function microsoftLogin(session, user, code)
{
   const { account: { username: email }} = await app.acquireTokenByCode({
       scopes: ['user.read'],
       redirectUri: config.redirect_uri,
       code
   });

   if (await getUserByMicrosoftEmail(email)) {
       throw 'Account already linked';
   }

   if (!domains.some(d => email.match(new RegExp(`.*@|\\.${d}`)))) {
       throw 'Not a IONIS e-mail';
   }

   user.microsoft_email = email;

   await updateUser(user.id, user, ['microsoft_email']);
   await updateSession(session, user);
}
