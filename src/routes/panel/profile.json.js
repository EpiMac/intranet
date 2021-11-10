import { getPublicData } from '$lib/server/auth';
import { updateUser } from '$lib/server/db';
import { updateSession } from '$lib/server/session';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(req)
{
    const { apple_id } = req.locals.user;
    const [user] = await updateUser(apple_id, req.body);
    
    await updateSession(req.locals.session, user);
    
    return {
        body: {
            user: getPublicData(user)
        }
    };
}