<script>
    import { onMount } from 'svelte';

    let page = 'Se connecter';
    let pages = ['Retour à l\'accueil', 'Mentions légales', 'À Propos'];

    let time = new Date();
    $: date = time.toLocaleDateString('fr', {
        weekday: 'short', day: 'numeric', month: 'short',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
    });

    onMount(() => {
        const interval = setInterval(() => time = new Date(), 1000);
        return () => clearInterval(interval);
    });
</script>

<div class="h-7 flex justify-between items-center  bg-black bg-opacity-18 bg-blur-50  font-sf text-white text-md text-shadow">
    <div>
        <span class="pl-6 pr-3 pb-px  leading-lg">􀣺</span>
        <span class="p-route font-bold">{page}</span>
        {#each pages as p}
            <span class="p-route cursor-pointer">{p}</span>
        {/each}
    </div>
    <span class="w-195px first-capitalize">{date}</span>
</div>
