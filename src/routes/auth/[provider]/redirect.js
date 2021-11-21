import { sessionCookie } from '$lib/server/session';
import { login } from '$lib/server/auth';

/**
 * Microsoft redirection
 *
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(request)
{
    console.log(JSON.stringify(request, null, 4));

    return {
        status: '302',
        headers: {
            Location: `/auth/microsoft/close`,
        }
    };
}

/**
 * Apple redirection
 *
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
            Location: `/auth/apple/close`,
            'Set-Cookie': sessionCookie(session)
        }
    };
}
