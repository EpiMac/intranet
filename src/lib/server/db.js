import postgres from 'postgres';

import { loadConfig } from '$lib/server/config';

const sql = postgres(loadConfig('postgres.json'));

export async function retrieveUser(appleId)
{
    return (await sql`
        SELECT * FROM users
            WHERE apple_id = ${appleId}
    `)[0];
}

export async function createUser(user)
{
    const extra = user.promo ? ['promo'] : [];

    return sql`
        INSERT INTO users ${
            sql(user, 'email', 'first_name', 'last_name', 'phone_number', 'apple_id', ...extra)
        }
        
        RETURNING *
    `;
}

export async function updateUser(appleId, user)
{
    return sql`
        UPDATE users SET ${
            sql(user, 'email', 'first_name', 'last_name', 'phone_number')
        } WHERE apple_id = ${appleId}

        RETURNING *
    `;
}