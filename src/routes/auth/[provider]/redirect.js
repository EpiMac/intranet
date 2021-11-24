import { microsoftLogin } from '$lib/server/ms';
import { sessionCookie } from '$lib/server/session';
import { login } from '$lib/server/auth';

// TODO: Manage state
// TODO: Handle errors

/**
 * Microsoft redirection
 *
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(request)
{
    const params = {};
    for (const [key, value] of request.query) {
        params[key] = value;
    }

    const { session, user } = request.locals;
    const { code } = params;

    await microsoftLogin(session, user, code);

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
