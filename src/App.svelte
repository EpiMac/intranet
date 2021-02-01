<script>
    import { Router, Route } from 'svelte-routing';

    import TopBar from './components/TopBar.svelte';

    import Login from './views/Login.svelte';
    import Main from './views/Main.svelte';

    import { user, setup } from './data/auth';
    setup();

    $: bg = $user ? 'bg-img-light dark:bg-img-dark' : 'bg-img-base';
</script>

<!-- TODO: UI animations on load -->
<!-- TODO: Responsive -->
<!-- TODO: Middlewares (routing security) -->
<!-- TODO: Fill in empty pages -->
<!-- TODO: Error handling -->
<!-- TODO: Clean code a bit -->
<main class="w-screen h-screen  flex flex-col  bg-black {bg} bg-cover">
    <Router> <!-- TODO: Route animations ? -->
        <TopBar />
        <div class="flex flex-grow">
            <Route path="/" component={Login} />
            <Route path="/app/*" component="{Main}" />
        </div>
    </Router>
</main>
