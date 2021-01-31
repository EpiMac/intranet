<script>
    import { Router, Route } from 'svelte-routing';

    import TopBar from './components/TopBar.svelte';

    import Login from './views/Login.svelte';
    import Profile from './views/Profile.svelte';
</script>

<main class="w-screen h-screen  flex flex-col  bg-img-base bg-cover">
    <Router>
        <TopBar />
        <div class="flex flex-grow">
            <Route path="/" component={Login} />
            <Route path="/profile" component="{Profile}" />
        </div>
    </Router>
</main>
