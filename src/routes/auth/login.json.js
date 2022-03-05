import { getPublicData, loginWithCredentials } from '$lib/server/auth';
import { sessionCookie } from '$lib/server/session';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(req)
{
    const { email, password } = { ...req.body };
    if (!email || !password) {
        return { status: 401, body: { error: 'Both email and password must be provided' }};
    }

    let result;
    try {
        result = await loginWithCredentials(email, password);
    } catch (e) {
        console.error(e);
        return { status: 401, body: { error: e.toString() }};
    }

    // TODO: Session expiration management
    return {
        headers: {
            'Set-Cookie': sessionCookie(result.session)
        },
        body: {
            user: getPublicData(result.user)
        }
    };
}
