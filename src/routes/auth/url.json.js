import { getLoginURL } from '$lib/server/auth';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get()
{
    return {
        body: {
            url: getLoginURL()
        }
    };
}
