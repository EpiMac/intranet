import { join } from 'path';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';


const CONFIG_FOLDER = process.env.INTRANET_CONFIG_FOLDER || 'config';

export function loadConfig(name)
{
    if (process.env.npm_lifecycle_script === 'svelte-kit build') {
        return {};
    }

    if (!existsSync(CONFIG_FOLDER)) {
        console.error(`Can't find config folder '${CONFIG_FOLDER}'.`);
        console.error('Folder was created with default config files, please fill them and restart the intranet.');

        initConfigFolder();

        process.exit(1);
    }

    const path = join(CONFIG_FOLDER, name + (name.includes('.') ? '' : '.json'));
    if (!existsSync(path)) {
        console.error(`Can't find required config file '${path}'.`);
        console.error('Please fill it and restart the intranet.');

        process.exit(1);
    }

    const content = readFileSync(path).toString();
    if (path.endsWith('.json')) {
        return JSON.parse(content);
    }

    return content;
}

function initConfigFolder()
{
    writeConfig('apple.json', {
        client_id: 'com.example.myapp',
        team_id: 'XXXXXXXXXX',
        key_id: 'XXXXXXXXXX',
        redirect_uri: 'https://example.com/auth/redirect',
        scope: 'name email'
    });

    writeConfig('postgres.json', {
        database: 'epimac_intranet'
    });

    writeConfig('microsoft.json', {
        client_id: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
        client_secret: '',
        tenant: 'common',
        redirect_uri: 'https://example.com/auth/microsoft/redirect'
    });

    writeConfig('drive.json', {
        key: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    });

    writeConfig('redis.json', {});
    writeConfig('apple_private_key.p8', 'INSERT YOUR PRIVATE KEY HERE');
    writeConfig('ionis_domains.json', ['example.com']);
    writeConfig('igen.json', {
        apiKey: "EXAMPLE_API_KEY",
        whitelistDomain: "example.com"
    });
}

function writeConfig(name, content)
{
    if (name.endsWith('.json')) {
        content = JSON.stringify(content, null, 4);
    }

    if (!existsSync(CONFIG_FOLDER)) {
        mkdirSync(CONFIG_FOLDER);
    }
    writeFileSync(join(CONFIG_FOLDER, name), content);
}
