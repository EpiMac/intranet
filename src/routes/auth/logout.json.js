import { sessionCookie, removeSession } from '$lib/server/session';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(req)
{
    if (req.locals.session) {
        await removeSession(req.locals.session);
    }

    return {
        body: {},
        headers: {
            'Set-Cookie': sessionCookie('')
        }
    };
}
