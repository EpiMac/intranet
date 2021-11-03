import AppleAuth from 'apple-auth';
import { decode } from 'jsonwebtoken';

import { loadConfig } from '$lib/server/config';
import { createSession } from '$lib/server/session';
import { retrieveUser } from '$lib/server/db';

const auth = new AppleAuth(loadConfig('apple.json'), loadConfig('apple_private_key.p8'), 'text');

export function getLoginURL()
{
    return auth.loginURL();
}

export async function login(code)
{
    const response = await auth.accessToken(code);
    const { sub: apple_id, email } = decode(response.id_token);

    return {
        session: await createSession(await retrieveUser(apple_id) || { apple_id, email })
    };
}

export function getPublicData(user)
{
    const result = {};
    const publicFields = ['email', 'first_name', 'last_name', 'phone_number', 'microsoft_email', 'promo'];

    for (const field of publicFields) {
        result[field] = user[field];
    }

    return result;
}
