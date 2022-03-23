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

export async function listDocuments()
{
    const result = await drive.files.list({
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive'
    });

    console.log(result.data.files);
}
