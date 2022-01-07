import postgres from 'postgres';
import { hash, argon2id } from 'argon2';

import { loadConfig } from '$lib/server/config';

const sql = postgres(loadConfig('postgres'));

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
    if (user.password) {
        user.password = await hash(user.password, { type: argon2id });
        extra.push('password');
    } else {
        extra.push('apple_id');
    }

    return sql`
        INSERT INTO users ${
            sql(user, 'email', 'first_name', 'last_name', 'phone_number', ...extra)
        }
        
        RETURNING *
    `;
}

export async function updateUser(appleId, user)
{
    return sql`
        UPDATE users SET ${
            sql(user, 'email', 'first_name', 'last_name', 'phone_number', 'microsoft_email')
        } WHERE apple_id = ${appleId}

        RETURNING *
    `;
}

export async function getUserByMicrosoftEmail(email)
{
    return (await sql`
        SELECT * FROM users
            WHERE microsoft_email = ${email}
    `)[0];
}
