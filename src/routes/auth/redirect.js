import { sessionCookie } from '$lib/server/session';
import { login } from '$lib/server/auth';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(request)
{
    // TODO: Manage state
    const { session } = await login(request.body.get('code'));

    // TODO: Session expiration management
    return {
        status: '302',
        headers: {
            Location: `/auth/close`,
            'Set-Cookie': sessionCookie(session)
        }
    };
}
