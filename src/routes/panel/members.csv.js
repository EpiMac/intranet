/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
import { getAllUsers } from '$lib/server/db.js';

export async function get(req)
{
    if (!req.locals.user.is_admin) {
        throw 'You must be admin';
    }

    const promo = req.url.searchParams.get('promo');
    const suffix = req.url.searchParams.get('email_suffix');

    const users = await getAllUsers(promo, suffix);

    return {
        body: users.map(u => [u.first_name, u.last_name, u.email, u.phone_number, u.microsoft_email || '(vide)', u.promo || '(vide)'].join(','))
                   .join('\n')
    };
}
