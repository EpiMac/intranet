<script>
    import { page } from '../../app/store';
    import Card from '../../components/Card.svelte';

    let opened = false; // TODO: Dynamic (webhook?)

    page.set('Ouverture du local');
</script>

<div class="flex flex-col items-center">
    <div class="flex justify-center items-center  w-60 h-60  mt-20  rounded-full  {opened ? 'bg-green-yes' : 'bg-red-no'} bg-blur  text-8xl text-shadow">
        {opened ? '􀎥' : '􀎡'}
    </div>
    <div class="font-semibold text-4xl  mt-14 mb-20">
        Le local est actuellement
        {#if opened}
            <span class="text-green-300">ouvert</span>
        {:else}
            <span class="text-red-no dark:text-red-no-dark">fermé</span>
        {/if}
    </div>
</div>

<Card title="Horaires d'ouverture">
    <p class="mb-3">
        Le local suit les horaires d'ouverture des locaux administratifs et est donc accessible usuellement de 9h à 22h.
    </p>
    <p>
        Ces horaires dépendent en revanche de la disponibilité des membres du personnel de l'association habilité à ouvrir le local.
    </p>
</Card>
<Card title="Notification">
    <p>
        Cliquez sur le bouton pour recevoir une notification sur votre navigateur lors de l'ouverture ou de la fermeture du local. Rappuyez simplement pour désactiver.
    </p>
    <button class="bg-green-yes  rounded   px-14 py-2 mt-5  font-sf">
        Activer les notifcations
    </button>
</Card>

<div class="text-transparent text-xs">.</div> <!-- TODO: !!!!! -->
