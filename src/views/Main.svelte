<script>
    import { Router, Route } from 'svelte-routing';

    import SideBar from '../components/SideBar.svelte';

    import Profile from './main/Profile.svelte';
    import Local from './main/Local.svelte'

    import { user } from '../app/store';
</script>

<SideBar />
<div
    class="
        flex flex-col items-center flex-grow
        bg-gray-800 bg-opacity-18 dark:bg-gray-900 dark:bg-opacity-50 bg-blur
        font-sf text-white text-shadow
        overflow-y-auto no-scrollbar
    "
    style="height: calc(100vh - 28px); /* TODO: !!! */"
>
    {#if $user}
        <Router>
            <Route path="/profile" component={Profile} />
            <Route path="/local" component={Local} />
        </Router>
    {:else}
        <div class="flex flex-grow items-center  font-bold text-3xl">
            Chargement...
        </div>
    {/if}
</div>
