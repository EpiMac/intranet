import { loadConfig } from '$lib/server/config.js';
import { getUserByEmail } from '$lib/server/db';

const apiKey = loadConfig('igen');

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(req)
{
    const { key, email } = req.body;
    if (key !== apiKey) {
        throw 'Bad API key';
    }

    const user = await getUserByEmail(email);
    return {
        body: {
            is_student: (user && user.microsoft_email && user.promo && user.promo >= new Date().getFullYear()) || false,
        }
    };
}
