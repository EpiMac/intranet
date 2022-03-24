import { listDocuments } from '$lib/server/drive.js';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get()
{
    let files;
    try {
        files = await listDocuments();
    } catch (e) {
        console.error(e);
        return { status: 401, body: { error: e.toString() } };
    }

    return {
        body: files.map(({ id, name }) => ({ id, name }))
    }
}
