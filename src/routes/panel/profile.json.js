import { getPublicData } from '$lib/server/auth';
import { updateUser } from '$lib/server/db';
import { updateSession } from '$lib/server/session';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(req)
{
    let { user, session } = req.locals;
    if (!session || !user) {
        throw 'You must be logged in';
    }

    try {
        user = await updateUser(user.id, await req.request.json());
    } catch (e) {
        console.error(e);
        return { status: 401, body: { error: e.toString() }};
    }

    await updateSession(session, user);

    return {
        body: {
            user: getPublicData(user)
        }
    };
}
