<script context="module">
    import { getUser, redirect } from '$lib/middleware';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ session }) {
        const user = getUser(session);
        if (!user) {
            return redirect('/auth/login');
        }

        return {
            props: { user }
        };
    }
</script>

<script>
    import { onMount } from 'svelte';

    export let user;

    onMount(() =>
    {
        window.opener.postMessage({ user }, window.origin);
        setTimeout(() => window.close(), 500);
    });
</script>

<div id="close">􀁣 Connecté en tant que <span class="email">{user.email}</span></div>

<style lang="scss">
    @import 'vars';

    #close {
        flex-grow: 1;
        justify-content: center;
        align-items: center;

        margin-bottom: 15px;

        font-family: $font-sf-text;
        font-size: 28px;

        .email {
            margin-left: 8px;

            font-weight: bold;
        }
    }
</style>
