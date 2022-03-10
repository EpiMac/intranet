import postgres from 'postgres';
import argon2 from 'argon2';

import { loadConfig } from '$lib/server/config';

const { hash, argon2id } = argon2;

const config = loadConfig('postgres');
const sql = postgres(config);

async function setup()
{
    // const root = sql({ ...config, database: 'postgres' });
    // TODO: Use a real ORM
}

export async function createUser(user)
{
    const extra = user.promo ? ['promo'] : [];
    if (user.password) {
        if (user.password.length < 6) {
            throw 'Mot de passe invalide';
        }

        user.password = await hash(user.password, { type: argon2id });
        extra.push('password');
    } else {
        extra.push('apple_id');
    }

    const fields = ['email', 'first_name', 'last_name', 'phone_number', ...extra];
    validateFields(user, fields);

    if (await getUserByEmail(user.email)) {
        throw 'Cette addresse e-mail est déjà prise';
    }

    return sql`
        INSERT INTO users ${
            sql(user, ...fields)
        }
        
        RETURNING *
    `;
}

export async function updateUser(id, user, extra)
{
    const fields = ['email', 'first_name', 'last_name', 'phone_number', ...(extra || [])];
    validateFields(user, fields);

    return (await sql`
        UPDATE users SET ${
            sql(user, ...fields)
        } WHERE id = ${id}

        RETURNING *
    `)[0];
}

export async function getAllUsers(promo, suffix)
{
    return sql`
        SELECT id, email, first_name, last_name, phone_number, microsoft_email, promo FROM users
            WHERE ((promo IS NULL AND COALESCE(${promo}) IS NULL) OR CAST(promo as varchar(255)) LIKE ${promo || '%'})
                AND ((users.microsoft_email IS NULL AND COALESCE(${suffix}) IS NULL) OR microsoft_email LIKE ${'%' + (suffix || '')})
    `;
}

// TODO: Generify?
export async function getUserByAppleId(appleId)
{
    return (await sql`
        SELECT * FROM users
            WHERE apple_id = ${appleId}
    `)[0];
}

export async function getUserByEmail(email)
{
    return (await sql`
        SELECT * FROM users
            WHERE email = ${email}
    `)[0];
}

export async function getUserByMicrosoftEmail(email)
{
    return (await sql`
        SELECT * FROM users
            WHERE microsoft_email = ${email}
    `)[0];
}

function validateFields(user, fields)
{
    for (const field of fields) {
        if (!user[field] || user[field].trim() === ' ') {
            throw 'Invalid fields content';
        }
    }
}

setup().catch(err => {
    console.error('Error during database setup, skipping');
    console.error(err);
})
