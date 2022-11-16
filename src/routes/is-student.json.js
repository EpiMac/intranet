import { loadConfig } from '$lib/server/config';
import { getUserByEmail, getUserByMicrosoftEmail } from '$lib/server/db';

const { apiKey, whitelistDomain } = loadConfig('igen');

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(req)
{
    const { key, email } = await req.request.json();
    if (key !== apiKey) {
        throw 'Bad API key';
    }

    let user = await getUserByEmail(email);
    if (!user) {
        user = await getUserByMicrosoftEmail(email);
    }

    const result = (user && user.microsoft_email && user.promo && user.promo >= new Date().getFullYear()) || email.endsWith('@' + whitelistDomain);
    return {
        body: {
            is_student: result,
            ...(result && user ? { promo: user.promo } : {})
        }
    };
}
