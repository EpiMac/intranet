import { parse } from 'cookie';

import { getPublicData } from '$lib/server/auth';
import { retrieveSession } from '$lib/server/session';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve })
{
    const { session } = parse(event.request.headers.get('cookie') || '');
    if (session) {
        event.locals.session = session;
        event.locals.user = await retrieveSession(session);
    }

    return await resolve(event);
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession({ locals })
{
    return {
        user: locals.user && getPublicData(locals.user)
    };
}
