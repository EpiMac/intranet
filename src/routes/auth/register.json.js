import { getPublicData } from '$lib/server/auth';
import { createUser } from '$lib/server/db';
import { createSession, sessionCookie, updateSession } from '$lib/server/session';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(req)
{
    const { apple_id } = req.locals.user || {};
    let user;
    try {
        [user] = await createUser({ apple_id, ...req.body });
    } catch (e) {
        console.error(e);
        return { status: 401, body: { error: e.toString() }};
    }

    // TODO: Move in auth.js?
    let session = apple_id ? await updateSession(req.locals.session, user) : await createSession(user);

    return {
        headers: {
            'Set-Cookie': sessionCookie(session)
        },
        body: {
            user: getPublicData(user)
        }
    };
}
