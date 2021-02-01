<script>
    import { navigate } from 'svelte-routing';
    import { logout } from '../data/auth';

    const logo = require('../assets/images/logo.png'); // TODO: Fix this webpack bug >:(
    const routes = [
        { label: 'Profil', icon: '􀉮', route: '/profile' },
        { label: 'Magasin', icon: '􀍪' },
        { label: 'Avantages', icon: '􀋃' },
        { label: 'Fichiers', icon: '􀈖' },
        { label: 'Ouverture du local', icon: '􀎡', route: '/local' }
    ];

    function handleRoute({ route })
    {
        if (route) {
            navigate(route);
        }
    }

    function handleLogout()
    {
        logout().then(() => navigate('/', { replace: true }));
    }
</script>

<!-- TODO: Sub router -->

<div class="w-400px h-full  flex flex-col justify-between items-center flex-shrink-0  text-white">
    <img src={logo} alt="Logo de l'Intranet EpiMac" class="px-10 pt-12" />
    <div class="w-full  flex flex-col items-center  mb-20">
        {#each routes as route}
            <div class="w-9/12  rounded  bg-gray-800 bg-blur bg-opacity-14  px-6 py-3.5 my-2  font-sf text-shadow  cursor-pointer" on:click={() => handleRoute(route)}>
                <span class="inline-block  mr-2.5 w-5  text-center">{route.icon}</span> {route.label}
            </div>
        {/each}
    </div>
    <button class="bg-trans-red  w-10/12  rounded  py-2.5 mb-10  font-sf" on:click={handleLogout}>
        Se déconnecter
    </button>
</div>
