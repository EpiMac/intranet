/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
import { listDocuments } from '$lib/server/drive.js';

export async function get(req)
{
    const documents = await listDocuments();

    return {
        body: {}
    }
}
