/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
import { getDocumentLink } from '$lib/server/drive.js';

export async function get(req)
{
    const { id } = req.params;

    let link;
    try {
        link = await getDocumentLink(id);
    } catch (e) {
        console.error(e);
        return { status: 401, body: e.toString() };
    }

    return {
        status: 302,
        headers: {
            Location: link,
        }
    };
}
