<script context="module">
    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ stuff: { user } }) {
        return {
            props: { user }
        };
    }
</script>

<script>
    import MsLogo from '/assets/microsoft_logo.svg';

    export let user;
</script>

<div class="header">
    <h1>Aucun compte Microsoft lié</h1>
</div>

<div class="perks card">
    <h1>Avantages</h1>

    Vous êtes étudiant dans une école du groupe IONIS ? Liez votre compte Microsoft scolaire pour obtenir des avantages exclusifs !
    <ul>
        <li>Accès au programme développeur Apple (permet de publier des applications sur l'App Store)</li>
        <li>Réduction sur l'abonnement à MacGeneration</li>
        <li>100Go de stockage iCloud</li>
    </ul>
    <button class="login">
        <img class="ms" src={MsLogo} alt="Microsoft" />
        Se connecter via Microsoft
    </button>
</div>

<style lang="scss">
    .header {
        justify-content: center;
        align-items: center;

        height: 300px;
    }

    .perks {
        flex-direction: column;
        align-items: flex-start;

        h1 {
            margin-bottom: 25px;
        }

        li {
            margin-bottom: 5px;
        }
    }

    .login {
        display: flex;
        justify-content: center;
        align-items: center;

        margin-top: 10px;
        padding: 12px 50px;

        background-color: black;

        font-size: 17px;

        .ms {
            margin-right: 12px;
        }
    }
</style>