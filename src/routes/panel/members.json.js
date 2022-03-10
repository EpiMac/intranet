/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
import { getAllUsers } from '$lib/server/db';

export async function get(req)
{
    if (!req.locals.user.is_admin) {
        throw 'You must be admin';
    }

    return {
        body: await getAllUsers()
    }
}
