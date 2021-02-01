<script>
    import { Router, Route } from 'svelte-routing';

    import TopBar from './components/TopBar.svelte';

    import Login from './views/Login.svelte';
    import Main from './views/Main.svelte';

    import { page, user } from './app/store';

    // Make it route dependant
    $: bg = $user ? 'bg-img-light dark:bg-img-dark' : 'bg-img-base';
</script>

<svelte:head>
    <title>EpiMac Intranet - {$page}</title>
</svelte:head>

<!-- TODO: UI animations on load -->
<!-- TODO: Responsive -->
<!-- TODO: Middlewares (routing security) -->
<!-- TODO: Fill in empty pages -->
<!-- TODO: Error handling -->
<main class="w-screen h-screen  flex flex-col  bg-black {bg} bg-cover">
    <Router> <!-- TODO: Route animations ? -->
        <TopBar />
        <div class="flex flex-grow">
            <Route path="/" component={Login} />
            <Route path="/app/*" component="{Main}" />
        </div>
    </Router>
</main>
