<script>
    import Card from '../components/Card.svelte';
    import page from '../data/page';
    import SideBar from '../components/SideBar.svelte';

    let opened = false;

    page.set('Ouverture du local');
</script>

<!-- TODO: Investigate top bar size page difference -->

<svelte:head>
    <title>EpiMac Intranet - Ouverture du local</title>
</svelte:head>

<div class="flex flex-grow  text-white">
    <SideBar />
    <div class="flex-grow  bg-gray-800 bg-opacity-18 bg-blur  font-sf text-shadow overflow-y-auto no-scrollbar" style="height: calc(100vh - 28px)"> <!-- TODO: !!! -->
        <div class="flex flex-col items-center">
            <div class="flex justify-center items-center  w-60 h-60  mt-20  rounded-full  bg-{opened ? 'green-yes' : 'red-no'} bg-blur  font-bold text-8xl text-shadow">
                {opened ? '􀎥' : '􀎡'}
            </div>
            <div class="font-semibold text-4xl  mt-14 mb-20">
                Le local est actuellement
                {#if opened}
                    <span class="text-green-300">ouvert</span>
                {:else}
                    <span class="text-red-no">fermé</span>
                {/if}
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
        </div>
        <div class="text-transparent text-xs">.</div> <!-- TODO: !!!!! -->
    </div>
</div>
