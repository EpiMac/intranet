import { getPublicData } from '$lib/server/auth';
import { createUser } from '$lib/server/db';
import { createSession, updateSession } from '$lib/server/session';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(req)
{
    const { apple_id } = req.locals.user || {};
    const [user] = await createUser({ apple_id, ...req.body });

    // TODO: Move in auth.js?
    if (apple_id) {
        await updateSession(req.locals.session, user);
    } else {
        await createSession(user);
    }

    return {
        body: {
            user: getPublicData(user)
        }
    };
}
