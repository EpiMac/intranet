<script context="module">
    import { getUser, redirect } from '$lib/middleware';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ session }) {
        const user = getUser(session);
        if (user && user.first_name) {
            return redirect('/panel');
        }

        return {
            props: { givenUser: user || {} }
        };
    }
</script>

<script>
    import { session } from '$app/stores';

    import Form from '$components/Form.svelte';
    import Link from '$components/Link.svelte';

    export let givenUser;

    function handleRegistration({ detail: { user }})
    {
        // This will trigger a soft-reload of the page sometimes
        session.update(s => ({ ...s, user }));
    }

    $: user = $session.user || givenUser;
    $: fields = [
        { name: 'first_name', label: 'Prénom', value: user.first_name || '' },
        { name: 'last_name', label: 'Nom de famille', value: user.last_name || '' },
        { name: 'email', label: 'E-Mail', value: user.email || '' },
        { name: 'phone_number', label: 'Numéro de téléphone', value: '' },

        ...(user.email ? [] : [
            { name: 'password', type: 'password', label: 'Mot de passe', value: '', confirmedBy: 'password_confirm' },
            { name: 'password_confirm', type: 'password', label: 'Confirmation du mot de passe', value: '', confirms: 'password' }
        ]),

        { name: 'promo', label: 'Promotion', value: '', optional: true }
    ];
    $: withApple = !!user.email;
</script>

<!-- TODO: Cancel button (with Apple) -->

<div id="register-container">
    <div id="register" class="card blurred">
        <h1 class="title">S'inscrire</h1>

        <p class="info">
            {#if withApple}
                Ce compte sera associé au compte Apple avec lequel vous vous êtes connecté.
                L'E-Mail du compte Apple est : <span class="email">{user.email}</span>

                L'association des comptes utilise les identifiants uniques, votre compte ne sera pas perdu même si l'e-mail
                change, que vous utilisez le système de relais privé d'Apple ou que vous vous inscrivez avec une adresse
                différente.


            {/if} Après la création de votre compte, vous pourrez modifier vos informations personnelles à tout moment.
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

            <div slot="submit">
                {#if !withApple}
                    <div id="legal">
                        En cliquant sur "S'inscrire" vous certifiez avoir
                        pris connaissance des <Link to="https://www.epimac.org/mentions-legales/">mentions légales</Link>
                    </div>
                {/if}
            </div>
        </Form>
    </div>

    {#if !withApple}
        <a id="back" href="/" sveltekit:prefetch>􀆉 Retour</a>
    {/if}
</div>

<style lang="scss">
    @import 'vars';

    #register-container {
        flex-grow: 1;
        flex-direction: column;
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

    #legal {
        align-items: center;

        margin-left: 20px;

        font-size: 14px;

        :global(.link) {
            margin-left: 4px; // TODO: Sad
            text-decoration: underline;
        }
    }

    #back {
        margin-top: 25px;

        font-size: 22px;
    }
</style>
