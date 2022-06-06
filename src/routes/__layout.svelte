<script>
    import { onMount } from 'svelte';

    import { title } from '/app';
    import { page } from '$app/stores';
    import titles from '$lib/titles';
    import { error, errorDisplayed } from '$lib/error';

    import Link from '$components/Link.svelte';

    import '/app.scss';

    let time = new Date();
    const links = [
        { label: 'Retour au site', url: 'https://www.epimac.org/', external: false },
        { label: 'Mentions légales', url: 'https://www.epimac.org/mentions-legales/' },
        { label: 'Discord', url: 'https://discord.com/invite/KtGBhWt' }
    ];

    onMount(() => {
        const interval = setInterval(() => time = new Date(), 500);
        return () => clearInterval(interval);
    });

    $: pageTitle = titles[$page.url.pathname];
    $: bg = $page.url.pathname.startsWith('/panel/') ? 'bg-color' : 'bg-base';
    $: date = time.toLocaleDateString('fr', {
        weekday: 'short', day: 'numeric', month: 'short',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
    });
</script>

<svelte:head>
    <title>{title(pageTitle)}</title>
</svelte:head>

<main class={bg}>
    <div id="top-bar" class="blurred">
        <div>
            <span id="apple">􀣺</span>
            <span id="title">{pageTitle || 'EpiMac'}</span>
            {#each links as { url, label, external }}
                <Link to={url} {external}>{label}</Link>
            {/each}
        </div>
        <span id="date">{date}</span>
    </div>

    <slot />

    <div id="error" class:displayed={$errorDisplayed}>
        <h1>Erreur</h1>
        <p class="description">{$error}</p>
    </div>
</main>

<style lang="scss">
    @import 'vars';

    main {
        flex-direction: column;

        width: 100vw;
        height: 100vh;

        background-color: black;
        background-size: cover;

        overflow: auto;

        &.bg-base {
            background-image: url('../assets/base-background.webp');
        }

        &.bg-color {
            background-image: url('../assets/light-background.jpg');
        }
    }

    #top-bar {
        flex-shrink: 0;

        display: flex;
        justify-content: space-between;
        align-items: center;

        height: 28px;

        font-family: $font-sf-text;
        font-size: 15px;

        background-color: rgba(0, 0, 0, .18);
        color: white;

        padding: 0 15px;

        #apple {
            margin-left: 7px;
            margin-right: 10px;
        }

        #title {
            font-weight: bold;
        }

        #title, :global(.link) {
            margin: 0 15px;
        }

        #date {
            width: 175px;

            &:first-letter {
                text-transform: capitalize;
            }
        }
    }

    #error {
        position: absolute;
        bottom: 0;

        flex-direction: column;

        width: 100%;

        padding: 15px 25px;

        background-color: rgb(224, 12, 12);

        transform: translateY(100px);
        transition: transform .2s;

        h1 {
            margin-bottom: 5px;
            font-size: 26px;
        }

        &.displayed {
            transform: translateY(0);
        }
    }

    @media (prefers-color-scheme: dark) {
        main.bg-color {
            background-image: url('../assets/dark-background.jpg');
        }
    }
</style>
