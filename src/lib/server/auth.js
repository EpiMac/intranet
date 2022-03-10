import AppleAuth from 'apple-auth';
import { decode } from 'jsonwebtoken';
import argon2 from 'argon2';

import { loadConfig } from '$lib/server/config';
import { createSession } from '$lib/server/session';
import { getUserByEmail, getUserByAppleId } from '$lib/server/db';

const { verify } = argon2;

const auth = new AppleAuth(loadConfig('apple'), loadConfig('apple_private_key.p8'), 'text');

export function getLoginURL()
{
    return auth.loginURL();
}

export async function loginWithApple(code)
{
    const response = await auth.accessToken(code);
    const { sub: apple_id, email } = decode(response.id_token);

    return {
        session: await createSession(await getUserByAppleId(apple_id) || { apple_id, email })
    };
}

export async function loginWithCredentials(email, password)
{
    const user = await getUserByEmail(email);
    if (!user || !user.password || !(await verify(user.password, password))) {
        throw 'Identifiants invalides';
    }

    return {
        user,
        session: await createSession(user)
    }
}

export function getPublicData(user)
{
    const result = {};
    const publicFields = ['email', 'first_name', 'last_name', 'phone_number', 'microsoft_email', 'promo', 'is_admin'];

    for (const field of publicFields) {
        result[field] = user[field];
    }

    result['with_apple'] = !!user.apple_id;

    return result;
}
