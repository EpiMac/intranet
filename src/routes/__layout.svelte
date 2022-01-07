<script>
    import { onMount } from 'svelte';

    import { title } from '/app';
    import { page } from '$app/stores';
    import titles from '$lib/titles';

    import Link from '$components/Link.svelte';

    import '/app.scss';

    let time = new Date();
    const links = [
        { label: 'Retour à l\'accueil', url: 'https://www.epimac.org/', external: false },
        { label: 'Mentions légales', url: 'https://www.epimac.org/mentions-legales/' },
        { label: 'À Propos' } // TODO: Proper about page
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
</main>

<style lang="scss">
    @import 'vars';

    main {
        flex-direction: column;

        width: 100vw;
        height: 100vh;

        background-color: black;
        background-size: cover;

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
            width: 170px;

            &:first-letter {
                text-transform: capitalize;
            }
        }
    }

    @media (prefers-color-scheme: dark) {
        main.bg-color {
            background-image: url('../assets/dark-background.jpg');
        }
    }
</style>
