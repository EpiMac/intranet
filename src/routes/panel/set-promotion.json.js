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
    if (user.promo) {
        throw 'Promotion already defined';
    }

    user.promo = req.body.promo;
    try {
        user = await updateUser(user.id, user, ['promo']);
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
