import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

import { loadConfig } from '$lib/server/config.js';

const config = loadConfig('drive');
const drive = google.drive({
    version: 'v3',
    auth: new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/drive',
        keyFilename: `config/${config.keyFilename}`
    })
});

const cache = {};

export async function listDocuments()
{
    return;
    /*await drive.permissions.create({
        fileId: '1TYYeUYHcSsmUoFU1lNzUnSOTCdii0vMj',
        requestBody: {
            role: 'reader',
            type: 'anyone'
        }
    });*/

    const result = await drive.files.list({
        q: 'mimeType != \'application/vnd.google-apps.folder\'',
        fields: 'nextPageToken, files(id, name, webContentLink)',
        spaces: 'drive'
    });

    const permissions = await drive.permissions.list({
        fileId: '1TYYeUYHcSsmUoFU1lNzUnSOTCdii0vMj',
    })

    console.log(result.data.files);
    console.log(permissions.data.permissions);
}

export async function download(document)
{

}
