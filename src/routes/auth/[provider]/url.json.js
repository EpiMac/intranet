import { getLoginURL } from '$lib/server/auth';
import { getMicrosoftURL } from '$lib/server/ms';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(request)
{
    const { provider } = request.params;
    return {
        body: {
            url: provider === 'apple' ? getLoginURL() : await getMicrosoftURL()
        }
    };
}
