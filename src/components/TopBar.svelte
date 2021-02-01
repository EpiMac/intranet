<script>
    import { onMount } from 'svelte';
    import { page } from '../app/store';

    const links = [
        { label: 'Retour à l\'accueil', url: 'https://www.epimac.org/' },
        { label: 'Mentions légales', url: 'https://www.epimac.org/mentions-legales/', external: true },
        { label: 'À Propos' } // TODO: Proper about page
    ];

    let time = new Date();
    $: date = time.toLocaleDateString('fr', {
        weekday: 'short', day: 'numeric', month: 'short',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
    });


    onMount(() =>
    {
        const interval = setInterval(() => time = new Date(), 1000);
        return () => clearInterval(interval);
    });

    function handleLink({ url, external })
    {
        if (!url) {
            return;
        }

        if (external) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    }
</script>

<div class="h-7 flex justify-between items-center  bg-black bg-opacity-18 bg-blur  font-sf text-white text-md text-shadow">
    <div>
        <span class="pl-6 pr-3 pb-px  leading-lg">􀣺</span>
        <span class="p-route font-bold">{$page}</span>
        {#each links as l}
            <span class="p-route cursor-pointer" on:click={() => handleLink(l)}>{l.label}</span>
        {/each}
    </div>
    <span class="w-180px first-capitalize">{date}</span>
</div>
