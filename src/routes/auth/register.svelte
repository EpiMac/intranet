<script context="module">
    import { getUser, redirect } from '$lib/middleware';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ session }) {
        const user = getUser(session);
        if (!user || user.first_name) {
            return redirect(user ? '/' : '/auth/login');
        }

        return {
            props: { user }
        };
    }
</script>

<script>
    import { session } from '$app/stores';

    import Form from '$components/Form.svelte';

    export let user;

    let fields = [
        { name: 'first_name', label: 'Prénom', value: user.first_name || '' },
        { name: 'last_name', label: 'Nom de famille', value: user.last_name || '' },
        { name: 'email', label: 'E-Mail', value: user.email },
        { name: 'phone_number', label: 'Numéro de téléphone', value: '' },
        { name: 'promo', label: 'Promotion', value: '', optional: true }
    ];

    function handleRegistration({ detail: { user }})
    {
        session.update(s => ({ ...s, user }));
    }

    $: logged = $session.user; // TODO: Issue about this being needed
</script>

<div id="register-container">
    <div id="register" class="card blurred">
        <h1 class="title">S'inscrire</h1>

        <p class="info">
            Ce compte sera associé au compte Apple avec lequel vous vous êtes connecté.
            L'E-Mail du compte Apple est : <span class="email">{user.email}</span>

            L'association des comptes utilise les identifiants uniques, votre compte ne sera pas perdu même si l'e-mail
            change, que vous utilisez le système de relais privé d'Apple ou que vous vous inscrivez avec une adresse
            différente.

            Après la création de votre compte, vous pourrez modifier vos informations personnelles à tout moment.
        </p>

        <h2 class="subtitle">Informations personnelles</h2>

        <Form label="S'inscrire" endpoint="/auth/register.json" {fields} on:posted={handleRegistration}>
            <div slot="field" class="slot" let:field>
                {#if field.name === 'promo'}
                    <p class="field-info">
                        Si vous êtes étudiant, merci de renseigner votre promotion. Sinon, laissez ce champ vide.
                    </p>
                {/if}
            </div>
        </Form>
    </div>
</div>

<style lang="scss">
    @import 'vars';

    #register-container {
        flex-grow: 1;
        justify-content: center;
        align-items: center;
    }

    #register {
        flex-direction: column;

        width: 1000px;
    }

    .title {
        margin-bottom: 20px;
    }

    .info .email {
        font-weight: bold;
    }

    .subtitle {
        margin: 17px 0;
    }

    .field-info {
        margin: 5px 0;
        grid-column: span 2;
    }
</style>
