<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    import { page, user } from '../app/store';
    import { login } from '../app/auth';

    const logo = require('../assets/images/logo.png');

    page.set('Se connecter');

    onMount(() =>
    {
        if ($user) {
            navigate('/app/profile', { replace: true });
        } else {
            return user.subscribe(u => u && navigate('/app/profile', { replace: true }))
        }
    });

    function handleLogin()
    {
        login().then(r => r && navigate('/app/profile', { replace: true }));
    }
</script>

<div class="flex flex-grow flex-col justify-evenly items-center  py-14">
    <img src={logo} alt="Logo de l'intranet EpiMac" class="w-700px" />
    <hr class="w-225px  border-t-2 rounded-full  shadow-separator">

    <button class="flex px-12 py-3 rounded bg-white text-black text-xl font-sf shadow-button" on:click={handleLogin}>
        <span class="-mt-px mr-2.5">􀣺</span> Continuer avec Apple
    </button>

    <p class="w-400px  text-white text-center text-sm font-sf font-light">
        En cliquant sur "Continuer avec Apple" vous certifiez avoir
        pris connaissance des
        <a class="underline" href="https://www.epimac.org/mentions-legales/" target="_blank">mentions légales</a>
    </p>
</div>
