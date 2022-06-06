<script context="module">
    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ fetch, stuff: { user } }) {
        const { url } = await fetch('/auth/microsoft/url.json').then(r => r.json());
        return {
            props: { givenUser: user, url }
        };
    }
</script>

<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { quadOut, quadIn } from 'svelte/easing';

    import { session } from '$app/stores';
    import { openPopup } from '$lib/popup';

    import Form from '$components/Form.svelte';
    import Loading from '$components/Loading.svelte';
    import Swapper from '$components/Swapper.svelte';

    import MsLogo from '/assets/microsoft_logo.svg?raw';

    export let givenUser;
    export let url;

    let loggingIn;
    let closePopup;

    const promoFields = [
        { name: 'promo', label: 'Promotion', value: '' }
    ];

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
        if (!msg.detail && (msg.origin !== window.origin || !msg.data.user)) {
            return;
        }

        const { user } = msg.detail || msg.data;

        // This will trigger a soft-reload of the page sometimes
        session.update(s => ({ ...s, user }));
    }

    $: user = $session.user || givenUser;
    $: email = user.microsoft_email;
    $: promo = user.promo;
</script>

<div class="header">
    <h1>{#if email}Compte lié : {email}{:else}Aucun compte Microsoft lié{/if}</h1>
</div>

<div class="perks card">
    <h1>Avantages</h1>

    {#if email && promo}
        En tant qu'étudiant dans une école du groupe IONIS, vous pouvez profiter des avantages suivants :
    {:else if email}
        Renseignez votre promotion pour pouvoir profiter des avantages suivants :
    {:else}
        Vous êtes étudiant dans une école du groupe IONIS ? Liez votre compte Microsoft scolaire pour obtenir des avantages exclusifs !
    {/if}

    <ul>
        <li>Accès au programme développeur Apple (permet de publier des applications sur l'App Store)</li>
        <li>Réduction sur l'abonnement à iGeneration</li>
        <li>100Go de stockage iCloud</li>
    </ul>

    {#if email && promo}
        Pour plus d'informations, rendez-vous sur le Discord de l'association
    {:else if email}
        <Form label="Envoyer" endpoint="/panel/set-promotion.json" fields={promoFields} on:posted={handleMessage} />
    {:else}
        <button class="login" class:unclickable={loggingIn}>
            <Swapper>
                <div
                        class="login-content"
                        slot="A" let:toggle let:outro
                        on:click={() => handleLogin(toggle)}
                        transition:fade|local={{ duration: 150, easing: quadOut }} on:outroend={outro}
                >
                    <div class="ms">{@html MsLogo}</div>
                    Se connecter via Microsoft
                </div>
                <div
                        class="login-content"
                        slot="B" let:outro
                        transition:fade|local={{ duration: 150, easing: quadIn }} on:outroend={outro}
                >
                    <Loading />
                </div>
            </Swapper>
        </button>
    {/if}
</div>

{#if email && promo}
    <div class="igen card">
        <h1>Club iGen</h1>

        Bénéficiez d'une remise sur l'abonnement annuel au Club iGen de MacGeneration à 20€/an au lieu de 50€/an.<br/>
        Cet abonnement vous permet de supprimer la publicité et le pistage sur les applications et le site, accéder à des
        articles exclusifs et bénéficier d'un confort de lecture sur les plateformes (choix des polices, mode nuit).

        <button class="do-it">Coming soon</button>
    </div>

    <div class="igen card">
        <h1>Apple Developer</h1>

        Obtenez un accès gratuit à la licence Apple Developer durant vos études.<br />Elle vous offre notamment la possibilité
        de déployer vos applications sur l'App Store ou TestFlight, télécharger les dernières versions des environnements
        d'Apple, et accéder au support et à la documentation Developer.

        <a href="/panel/submit-dev" sveltekit:prefetch><button class="do-it">Profiter</button></a>
    </div>
{/if}

<style lang="scss">
    .header {
        flex-shrink: 0;

        justify-content: center;
        align-items: center;

        height: 300px;
    }

    .card {
        flex-direction: column;
        align-items: flex-start;

        h1 {
            margin-bottom: 25px;
        }
    }

    .perks {
        li {
            margin-bottom: 5px;
        }

        :global(.form) {
            margin-top: 10px;
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

    .igen {
        margin-top: 25px;

        flex-direction: column;
        align-items: flex-start;

        h1 {
            margin-bottom: 25px;
        }

        .do-it {
            margin-top: 25px;
        }
    }
</style>
