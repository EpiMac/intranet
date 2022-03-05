<script context="module">
    import { getUser, redirect } from '$lib/middleware';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ session }) {
        const user = getUser(session);
        if (user) {
            return redirect(user.first_name ? '/panel' : '/auth/register');
        }

        return {};
    }
</script>

<script>
    import { session } from '$app/stores';

    import Form from '$components/Form.svelte';
    import Link from '$components/Link.svelte';

    let fields = [
        { name: 'email', label: 'E-Mail', value: '' }, // TODO: Local storage?
        { name: 'password', type: 'password', label: 'Mot de passe', value: '' },
    ];

    function handleLogin({ detail: { user }})
    {
        session.update(s => ({ ...s, user }));
    }

    $: logged = $session.user; // TODO: Issue about this being needed
</script>

<div id="login-container">
    <div id="login" class="card blurred">
        <h1 class="title">Se connecter</h1>

        <div class="info">
            Pas de compte ?&nbsp;<Link to="/auth/register">Cliquez ici pour vous inscrire !</Link>
        </div>

        <Form label="Se connecter" endpoint="/auth/login.json" {fields} on:posted={handleLogin} />
    </div>

    <a id="back" href="/" sveltekit:prefetch>􀆉 Retour</a>
</div>

<style lang="scss">
    @import 'vars';

    #login-container {
        flex-grow: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #login {
        flex-direction: column;
        width: 500px;

        :global(.form) {
            display: flex;
            flex-direction: column;
        }

        :global(.link) {
            text-decoration: underline;
        }
    }

    .title {
        margin-bottom: 20px;
    }

    .info {
        margin-bottom: 20px;
    }

    #back {
        margin-top: 25px;

        font-size: 22px;
    }
</style>
