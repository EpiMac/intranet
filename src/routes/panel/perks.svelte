<script context="module">
    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ fetch, stuff: { user } }) {
        const { url } = await fetch('/auth/microsoft/url.json').then(r => r.json());
        return {
            props: { user, url }
        };
    }
</script>

<script>
    import { session } from '$app/stores';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { quadOut, quadIn } from 'svelte/easing';

    import { openPopup } from '$lib/popup';

    import Loading from '$components/Loading.svelte';
    import Swapper from '$components/Swapper.svelte';

    import MsLogo from '/assets/microsoft_logo.svg?raw';

    // TODO: Fix refresh after linking

    export let user;
    export let url;

    let loggingIn;
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
        loggingIn = true;

        openPopup(url, 'Se connecter avec Microsoft', () => {
            toggle();
            loggingIn = false;
        });
    }

    function handleMessage(msg)
    {
        if (msg.origin !== window.origin || !msg.data.user) {
            return;
        }

        const { user } = msg.data;
        session.update(s => ({ ...s, user }));
    }

    $: email = user.microsoft_email;
</script>

<div class="header">
    <h1>{#if email}Compte lié : {email}{:else}Aucun compte Microsoft lié{/if}</h1>
</div>

<div class="perks card">
    <h1>Avantages</h1>

    {#if email}
        En tant qu'étudiant dans une école du groupe IONIS, vous pouvez profiter des avantages suivants :
    {:else}
        Vous êtes étudiant dans une école du groupe IONIS ? Liez votre compte Microsoft scolaire pour obtenir des avantages exclusifs !
    {/if}

    <ul>
        <li>Accès au programme développeur Apple (permet de publier des applications sur l'App Store)</li>
        <li>Réduction sur l'abonnement à MacGeneration</li>
        <li>100Go de stockage iCloud</li>
    </ul>

    {#if email}
        Pour plus d'informations, rendez-vous sur le Discord de l'association
    {:else}
        <button class="login" class:unclickable={loggingIn}>
            <Swapper>
                <div
                        class="login-content"
                        slot="A" let:toggle let:outro
                        on:click={() => handleLogin(toggle)}
                        transition:fade={{ duration: 150, easing: quadOut }} on:outroend={outro}
                >
                    <div class="ms">{@html MsLogo}</div>
                    Se connecter via Microsoft
                </div>
                <div
                        class="login-content"
                        slot="B" let:outro
                        transition:fade={{ duration: 150, easing: quadIn }} on:outroend={outro}
                >
                    <Loading />
                </div>
            </Swapper>
        </button>
    {/if}
</div>

<style lang="scss">
    .header {
        justify-content: center;
        align-items: center;

        height: 300px;
    }

    .perks {
        flex-direction: column;
        align-items: flex-start;

        h1 {
            margin-bottom: 25px;
        }

        li {
            margin-bottom: 5px;
        }
    }

    .login {
        // TODO: Clean this...

        margin-top: 10px;
        padding: 0;

        background-color: black;

        font-size: 17px;

        .login-content {
            // Needed because of the loading being scaled down
            width: 350px;
            height: 45px;

            justify-content: center;
            align-items: center;
        }

        .ms {
            margin-right: 12px;
        }
    }

    :global(.loading) {
        transform: scale(0.35) translateY(2px);
    }
</style>
