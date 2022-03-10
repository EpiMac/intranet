import { loadConfig } from '$lib/server/config';
import { getUserByEmail, getUserByMicrosoftEmail } from '$lib/server/db';

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

    let user = await getUserByEmail(email);
    if (!user) {
        user = await getUserByMicrosoftEmail(email);
    }
    return {
        body: {
            is_student: (user && user.microsoft_email && user.promo && user.promo >= new Date().getFullYear()) || false,
        }
    };
}
