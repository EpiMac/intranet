<script>
    import { Router, Route } from 'svelte-routing';

    import TopBar from './components/TopBar.svelte';

    import Login from './views/Login.svelte';
    import Profile from './views/Profile.svelte';

    import { user, setup } from './data/auth';
    setup();

    // TODO: Dark theme
    $: bg = $user ? 'light' : 'base';
</script>

<main class="w-screen h-screen  flex flex-col  bg-img-{bg} bg-cover">
    <Router>
        <TopBar />
        <div class="flex flex-grow">
            <Route path="/" component={Login} />
            <Route path="/profile" component="{Profile}" />
        </div>
    </Router>
</main>
