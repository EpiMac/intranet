import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

import { loadConfig } from '$lib/server/config';

const CACHE_LIFETIME = 10000; // Ten seconds

const config = loadConfig('drive');
const drive = google.drive({
    version: 'v3',
    auth: new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/drive',
        keyFilename: `config/${config.keyFilename}`
    })
});

const cache = {
    list: { time: 0 },
    download: {}
};

export async function listDocuments()
{
    if (new Date() - cache.list.time < CACHE_LIFETIME) {
        return cache.list.files;
    }

    const { data: { files } } = await drive.files.list({
        q: 'mimeType != \'application/vnd.google-apps.folder\'',
        fields: 'nextPageToken, files(id, name, webContentLink)',
        spaces: 'drive'
    });

    cache.list = { files, time: new Date() };

    return files;
}

export async function getDocumentLink(id)
{
    if (!cache.download[id]) {
        const { data: { permissions } } = await drive.permissions.list({ fileId: id });
        if (!permissions.find(p => p.type === 'anyone' && p.type === 'reader')) {
            await drive.permissions.create({
                fileId: id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });
        }

        cache.download[id] = true;
    }

    const files = cache.list.files || await listDocuments();
    const file = files.find(f => f.id === id);
    if (!file) {
        throw 'Unknown file';
    }

    return file.webContentLink;
}
