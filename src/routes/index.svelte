<script context="module">
    import { getUser, redirect } from '$lib/middleware.js';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ fetch, session }) {
        const user = getUser(session);
        if (user) {
            return redirect(user.first_name ? '/panel' : '/auth/register');
        }

        const { url } = await fetch('/auth/apple/url.json').then(r => r.json());
        return {
            props: { url }
        };
    }
</script>

<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { quadOut, quadIn } from 'svelte/easing';

    import { goto } from '$app/navigation.js';
    import { session } from '$app/stores.js';

    import { openPopup } from '$lib/popup.js';

    import Link from '$components/Link.svelte';
    import Swapper from '$components/Swapper.svelte';
    import Loading from '$components/Loading.svelte';

    import Logo from '/assets/logo.webp';


    export let url;
    let closePopup;

    onMount(() =>
    {
        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);

            if (closePopup) {
                closePopup();
            }
        };
    });

    function handleLogin(toggle)
    {
        toggle();
        closePopup = openPopup(url, 'Se connecter avec Apple', toggle);
    }

    function handleMessage(msg)
    {
        if (msg.origin !== window.origin || !msg.data.user) {
            return;
        }

        const { user } = msg.data;
        const next = user.first_name ? '/' : '/auth/register';

        session.update(s => ({ ...s, user }));
        goto(next);
    }

    $: logged = $session.user;
</script>

<div id="login-page">
    <img id="logo" src={Logo} alt="Logo" />
    <hr id="separator" />

    <Swapper>
        <div
            id="login-buttons"
            slot="A" let:toggle let:outro
            transition:fade|local={{ duration: 150, easing: quadOut }} on:outroend={outro}
        >
            <a id="login-container" href="/auth/login" sveltekit:prefetch>
                <button id="login" class="login-button">
                    Se connecter
                </button>
            </a>
            <a id="register-container" href="/auth/register" sveltekit:prefetch>
                <button id="register" class="login-button">
                    S'inscrire
                </button>
            </a>

            <div id="or">ou</div>

            <button id="apple-login" class="opaque" on:click={() => handleLogin(toggle)}>
                <span class="apple">􀣺</span> Continuer avec Apple
            </button>
        </div>
        <div
                id="loading-container"
                slot="B" let:outro
                transition:fade|local={{ duration: 150, easing: quadIn }} on:outroend={outro}
        >
            <Loading />
        </div>
    </Swapper>

    <p id="terms">
        En cliquant sur "Continuer avec Apple" vous certifiez avoir
        pris connaissance des <Link to="https://www.epimac.org/mentions-legales/">mentions légales</Link>
    </p>
</div>

<style lang="scss">
    @import "src/styles/mixins";
    @import "src/styles/vars";

    #login-page {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        flex-grow: 1;

        padding: 75px 0;
    }

    #logo {
        width: 700px;
    }

    #separator {
        width: 225px;

        border: none;
        border-top: solid 2px #e5e7eb;
        border-radius: 2px;

        box-shadow: 0 4px 15px rgba(0, 0, 0, .7);
    }

    #login-buttons {
        flex-direction: column;
        align-items: center;

        .login-button {
            width: 100%;

            margin-top: 15px;
            padding: 12px 0;

            font-size: 16px;
        }

        #login-container, #register-container {
            width: 100%;
        }

        #or {
            margin: 15px 0;
        }

        #apple-login {
            display: flex;

            padding: 13px 48px;

            font-family: $font-sf-text;
            font-size: 20px;

            background-color: white;
            color: black;

            border-radius: 4px;

            box-shadow: 0 11px 17px rgba(0, 0, 0, .4);

            .apple {
                margin-top: -1px;
                margin-right: 10px;
            }

            @include clickable(background-color, #ddd, #bbb);
        }
    }

    #loading-container {
        height: 219px;

        align-items: center;
    }

    #terms {
        width: 400px;

        font-family: $font-sf-text;
        font-weight: 300;
        font-size: 14px;

        text-align: center;

        color: white;

        :global(.link) {
            text-decoration: underline;
        }
    }
</style>
