import { loadConfig } from '$lib/server/config';
import { PublicClientApplication } from '@azure/msal-node';

const config = loadConfig('microsoft');
const app = new PublicClientApplication({
    auth: {
        clientId: config.client_id,
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
