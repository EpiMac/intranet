import { v4 } from 'uuid';
import { createClient } from 'redis';
import { serialize } from 'cookie';

import { loadConfig } from '$lib/server/config';

const SESSION_COOKIE = 'session';

let client;

async function init()
{
    client = createClient(loadConfig('redis'));
    client.on('error', err => console.error('Redis client error', err));

    await client.connect();
}

export async function createSession(user)
{
    if (!client) await init();

    const id = v4();
    await updateSession(id, user);

    return id;
}

export async function retrieveSession(id)
{
    if (!client) await init();

    return JSON.parse(await client.get(id));
}

export async function updateSession(id, user)
{
    await client.set(id, JSON.stringify(user));
    return id;
}

export async function removeSession(id)
{
    await client.del(id);
}

export function sessionCookie(value)
{
    return serialize(SESSION_COOKIE, value, {
        path: '/',
        httpOnly: true
    });
}
