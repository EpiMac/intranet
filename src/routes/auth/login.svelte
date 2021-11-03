<script context="module">
    import { getUser, redirect } from '$lib/middleware';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ fetch, session }) {
        const user = getUser(session);
        if (user) {
            return redirect(user.first_name ? '/' : '/auth/register');
        }

        const { url } = await fetch('/auth/url.json').then(r => r.json());
        return {
            props: { url }
        };
    }
</script>

<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { quadOut, quadIn } from 'svelte/easing';

    import { prefetch } from '$app/navigation';
    import { session } from '$app/stores';

    import { title } from '/app';

    import Link from '$components/Link.svelte';
    import Swapper from '$components/Swapper.svelte';
    import Loading from '$components/Loading.svelte';

    import Logo from '/assets/logo.webp';


    export let url;

    onMount(() =>
    {
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    });

    function handleLogin()
    {
        const width = Math.min(900, screen.width - 50), height = 800;
        const x = screen.width / 2 - width / 2, y = screen.height / 2 - height / 2 - 65;
        const options = `menubar=no, status=no, scrollbars=no, menubar=no, width=${width}, height=${height}, top=${y}, left=${x}`;

        window.open(url, title('Se connecter avec Apple'), options);
    }

    function handleMessage(msg)
    {
        if (msg.origin !== window.origin || !msg.data.user) {
            return;
        }

        const { user } = msg.data;
        const next = user.first_name ? '/' : '/auth/register';

        session.update(s => ({ ...s, user }));
        prefetch(next); // This triggers a reload of this page which triggers a redirection, I have no idea why
    }

    $: logged = $session.user;
</script>

<div id="login-page">
    <img id="logo" src={Logo} alt="Logo" />
    <hr id="separator" />

    <Swapper>
        <button
                id="login" class="opaque"
                slot="A" let:toggle let:outro
                on:click={() => { toggle(); handleLogin() }}
                transition:fade={{ duration: 150, easing: quadOut }} on:outroend={outro}
        >
            <span class="apple">􀣺</span> Continuer avec Apple
        </button>
        <div
                id="loading-container"
                slot="B" let:outro
                transition:fade={{ duration: 150, easing: quadIn }} on:outroend={outro}
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
    @import 'mixins';
    @import 'vars';

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

    #login {
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

    #loading-container {
        height: 51px;
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
