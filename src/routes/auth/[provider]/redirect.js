import { microsoftLogin } from '$lib/server/ms';
import { sessionCookie } from '$lib/server/session';
import { loginWithApple } from '$lib/server/auth';

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
    for (const [key, value] of request.url.searchParams) {
        params[key] = value;
    }

    const { session, user } = request.locals;
    const { code } = params;

    if (!session || !user || !code) {
       throw 'Invalid parameters';
    }

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
    const code = request.body.get('code');
    if (!code) {
        throw 'Invalid parameters';
    }

    const { session } = await loginWithApple(code);

    // TODO: Session expiration management
    return {
        status: '302',
        headers: {
            Location: `/auth/apple/close`,
            'Set-Cookie': sessionCookie(session)
        }
    };
}
