<script>
    import { Router, Route } from 'svelte-routing';

    import TopBar from './components/TopBar.svelte';

    import Login from './views/Login.svelte';
    import Profile from './views/Profile.svelte';
    import Local from './views/Local.svelte';

    import { user, setup } from './data/auth';
    setup();

    // TODO: Dark theme
    $: bg = $user ? 'light' : 'base';
</script>

<!-- TODO: UI animations on load -->
<!-- TODO: Better load time handle no background -->
<!-- TODO: Responsive -->
<!-- TODO: Middlewares (routing security) -->
<!-- TODO: Fill in empty pages -->
<!-- TODO: Error handling -->
<!-- TODO: Migrate on Firebase -->
<!-- TODO: Clean code a bit -->
<main class="w-screen h-screen  flex flex-col  bg-black bg-img-{bg} bg-cover">
    <Router> <!-- TODO: Route animations ? -->
        <TopBar />
        <div class="flex flex-grow">
            <Route path="/" component={Login} />
            <Route path="/profile" component="{Profile}" />
            <Route path="/local" component="{Local}" />
        </div>
    </Router>
</main>
