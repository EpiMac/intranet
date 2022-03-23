import { getPublicData } from '$lib/server/auth';
import { updateUser } from '$lib/server/db';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(req)
{
    if (!req.locals.user.is_admin) {
        throw 'You must be admin';
    }

    const user = await req.request.json();
    let result;
    try {
        const extra = [];
        if (user.microsoft_email) {
            extra.push('microsoft_email');
        }
        if (user.promo) {
            extra.push('promo');
        }

        result = await updateUser(user.id, user, extra);
    } catch (e) {
        console.error(e);
        return { status: 401, body: { error: e.toString() }};
    }

    return {
        body: {
            user: { id: result.id, ...getPublicData(result) }
        }
    };
}
