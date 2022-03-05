import { getPublicData } from '$lib/server/auth';
import { getUserByEmail, updateUser } from '$lib/server/db';
import { updateSession } from '$lib/server/session';
import { argon2id, hash, verify } from 'argon2';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(req)
{
    let { user, session } = req.locals;
    if (!session || !user || !user.password) {
        throw 'You must be logged in';
    }

    const { old_password, password } = req.body;
    if (!old_password || !password) {
        throw 'Invalid parameters';
    }

    // TODO: Move in auth.js
    if (!(await verify(user.password, old_password))) {
        return { status: 401, body: { error: 'Mauvais mot de passe actuel' }};
    }

    if (!password || password.length < 6) {
        // TODO: Generify errors
        return { status: 401, body: { error: 'Nouveau mot de passe invalide' }};
    }

    user.password = await hash(password, { type: argon2id });

    try {
        user = await updateUser(user.id, user, ['password']);
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
