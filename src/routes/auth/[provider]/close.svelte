<script context="module">
    import { getUser, redirect } from '$lib/middleware';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ params: { provider }, session }) {
        const user = getUser(session);
        if (!user) {
            return redirect('/');
        }

        return {
            props: { user, provider }
        };
    }
</script>

<script>
    import { onMount } from 'svelte';

    export let user;
    export let provider;

    onMount(() =>
    {
        window.opener.postMessage({ user }, window.origin);
        setTimeout(() => window.close(), 500);
    });

    $: email = provider === 'apple' ? user.email : user.microsoft_email;
</script>

<div id="close">􀁣 Connecté en tant que <span class="email">{email}</span></div>

<style lang="scss">
    @import "src/styles/vars";

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
