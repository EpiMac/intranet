<script>
    import { navigate } from 'svelte-routing';

    import { login } from '../data/auth';
    import page from '../data/page';

    const logo = require('../assets/images/logo.png');

    function handleLogin()
    {
        login().then(() => navigate("/profile", { replace: true }));
    }

    page.set('Se connecter');
</script>

<div class="flex flex-grow flex-col justify-evenly items-center  py-14">
    <img src={logo} alt="Logo de l'intranet EpiMac" class="w-700px" />
    <hr class="w-225px  border-t-2 rounded-full  shadow-separator">

    <button class="flex px-12 py-3 rounded bg-white text-black text-xl font-sf shadow-button" on:click={handleLogin}>
        <span class="-mt-px mr-2.5">􀣺</span> Continuer avec Apple
    </button>

    <p class="w-400px  text-white text-center text-sm font-sf-compact-display font-light">
        En cliquant sur "Continuer avec Apple" vous certifiez avoir
        pris connaissance des <span class="underline">mentions légales</span>
    </p>
</div>
