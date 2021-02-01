<script>
    import Card from '../components/Card.svelte';
    import SideBar from '../components/SideBar.svelte';

    import { user, isLinked, linkMicrosoft } from '../data/auth';
    import page from '../data/page';

    const msLogo = require('../assets/images/microsoft_logo.svg');

    function handleLink()
    {
        // TODO: Prevent multiple clicks
        linkMicrosoft();
    }

    page.set('Profil');
</script>

<svelte:head>
    <title>EpiMac Intranet - Profil</title>
</svelte:head>

<div class="flex flex-grow  text-white">
    <SideBar />
    {#if $user} <!-- TODO: Middleware + Better way ? (Loading + Promise ?) -->
        <div class="flex flex-col items-center flex-grow  bg-gray-800 bg-opacity-18 bg-blur  font-sf text-shadow  overflow-y-auto no-scrollbar" style="height: calc(100vh - 28px)"> <!-- TODO: !!! -->
            <div class="flex flex-col items-center  py-24">
                <div class="w-40 h-40  mb-7  rounded-full">
                    {#if $user.photoURL}
                        <img src={$user.photoURL} alt="Image de l'utilisateur" />
                    {:else}
                        <div class="w-full h-full  bg-gray-700  flex justify-center items-center  rounded-full  font-sf-display font-semibold text-6xl">
                            {$user.displayName[0]}
                        </div>
                    {/if}
                </div>
                <div class="font-semibold text-3xl">{$user.displayName}</div>
                <div class="text-xl">{$user.email}</div>
            </div>

            <Card title="Avantages IONIS">
                <p>
                    {#if $isLinked}
                        Votre compte EpiMac est lié au compte Microsoft : <span class="font-semibold">{$user.providerData[1].email}</span><br/>
                        Vous bénéficiez donc des avantages suivants :
                    {:else}
                        Vous êtes étudiants d'une école du groupe IONIS ?<br/>
                        Liez votre compte Microsoft et accédez à des avantages exclusifs :
                    {/if}
                </p>
                <ul class="pl-7 mt-5">
                    <li>- Accès gratuit au programme développeur Apple (au lieu de 99$ par an)</li>
                    <li>- 100Go de stockage iCloud</li>
                </ul>
                {#if !$isLinked}
                    <button class="flex  bg-black  px-10 py-2.5 mt-6  rounded" on:click={handleLink}>
                        <img src={msLogo} alt="Logo Microsoft" class="mr-3.5 w-5" />
                        Se connecter via Microsoft
                    </button>
                {/if}
            </Card>
            <div class="text-transparent text-xs">.</div> <!-- TODO: !!!!! -->
        </div>
    {/if}
</div>
