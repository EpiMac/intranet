export function getUser(session)
{
    return session && session.user;
}

export function redirect(url, permanent)
{
    return {
        status: permanent ? 301 : 302,
        redirect: url
    };
}