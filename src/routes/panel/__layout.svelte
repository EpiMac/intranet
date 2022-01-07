<script context="module">
    import { getUser, redirect } from '$lib/middleware';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ session }) {
        const user = getUser(session);
        if (!user || !user.first_name) {
            return redirect('/auth/login');
        }

        return {
            props: { admin: user.is_admin },
            stuff: { user, submitted: session && session.submitted }
        };
    }
</script>

<script>
    import { goto } from '$app/navigation';
    import { session, page } from '$app/stores';

    import Logo from '/assets/logo.webp';

    export let admin;

    const routes = [
        { label: 'Profil', icon: '􀉮', route: '/panel/profile' },
        { label: 'Magasin', icon: '􀍪' },
        { label: 'Avantages', icon: '􀋃', route: '/panel/perks' },
        { label: 'Fichiers', icon: '􀈖' },
        { label: 'Ouverture du local', icon: '􀎡' },
        ...(admin ? [{ label: 'Liste des membres', icon: '􀋲' , route: '/panel/members' }] : [])
    ];

    let loggingOut = false;

    function handleLogout()
    {
        if (loggingOut) {
            return;
        }

        loggingOut = true;

        fetch('/auth/logout.json', { method: 'POST' })
            .then(() => {
                session.update(s => ({ ...s, user: null }));
                goto('/auth/login');
            })
            .catch(err => console.error(err));
    }

    $: s = $session;
</script>

<div id="panel">
    <div id="side-bar">
        <img class="logo" src={Logo} alt="Logo" />

        <nav>
            {#each routes as { icon, route, label }}
                <a class="route card blurred" class:selected={$page.url.pathname === route} href={route} sveltekit:prefetch>
                    <span class="icon">{icon}</span>
                    {label}
                </a>
            {/each}
        </nav>

        <button class="logout card blurred" disabled={loggingOut} on:click={handleLogout}>Se déconnecter</button>
    </div>
    <div id="content" class="card blurred">
        <slot />
    </div>
</div>

<style lang="scss">
    #panel {
        flex-grow: 1;
    }

    #panel, #content {
        overflow-y: auto;
    }

    #side-bar {
        flex-shrink: 0;
        flex-direction: column;
        justify-content: space-between;

        width: 400px;

        .logo {
            max-width: 100%;

            margin-top: 50px;
            padding: 0 40px;
        }

        nav {
            flex-direction: column;

            margin-bottom: 35px;

            .route {
                margin: 10px 50px;
                padding: 16px 25px;

                &.selected {
                    font-weight: bold;
                }

                .icon {
                    display: inline-block;
                    width: 20px;

                    margin-right: 13px;

                    font-weight: normal;
                }
            }
        }

        .logout {
            margin: 35px;
            padding: 12px 0;

            font-size: 16px;

            background-color: rgba(181,4,4,.75);
        }
    }

    #content {
        flex-grow: 1;
        flex-direction: column;

        border-radius: 0;
    }
</style>
