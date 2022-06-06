import { request } from 'https';
import { loadConfig } from '$lib/server/config.js';

const { hook } = loadConfig('discord');

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(req)
{
    let { user, session } = req.locals;
    if (!session || !user || !user.microsoft_email || !user.promo) {
        throw 'You must be logged in and have perks unlocked';
    }

    const { email, reason } = await req.request.json();
    if (!email || !reason) {
        throw 'Invalid parameters';
    }

    const data = JSON.stringify({
        content: `**Nom** : ${user.first_name} ${user.last_name}\n**E-Mail Apple** : \`${email}\`\n**Motif** :\n\`\`\`${reason}\`\`\``
    });
    
    const hookRequest = request(hook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    });
    hookRequest.write(data);
    hookRequest.end();

    return {
        body: {
            success: true
        }
    };
}
