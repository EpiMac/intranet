import { parse } from 'cookie';

import { getPublicData } from '$lib/server/auth';
import { retrieveSession } from '$lib/server/session';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve })
{
    const { session } = parse(request.headers.cookie || '');
    if (session) {
        request.locals.session = session;
        request.locals.user = await retrieveSession(session);
    }

    return await resolve(request);
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession({ locals })
{
    return {
        user: locals.user && getPublicData(locals.user)
    };
}
