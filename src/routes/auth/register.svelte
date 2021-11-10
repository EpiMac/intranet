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
    import { goto } from '$app/navigation';
    import { session } from '$app/stores';

    export let user;

    // TODO: Better validation
    let registering = false;
    let fields = [
        { name: 'first_name', label: 'Prénom', value: user.first_name || '' },
        { name: 'last_name', label: 'Nom de famille', value: user.last_name || '' },
        { name: 'email', label: 'E-Mail', value: user.email },
        { name: 'phone_number', label: 'Numéro de téléphone', value: '' },
        { name: 'promo', label: 'Promotion', value: '', optional: true }
    ];

    function handleRegistration()
    {
        if (registering) {
            return;
        }

        registering = true;

        const data = {};
        for (const { name, value } of fields) {
            if (value.trim() !== '') {
                data[name] = value;
            }
        }

        fetch('/auth/register.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(r => r.json()).then(({ user }) => {
            session.update(s => ({ ...s, user }));
            goto('/');
        }).catch(err => console.error(err));
    }

    $: logged = $session.user; // TODO: Issue about this being needed
    $: canRegister = fields.filter(({ value, optional }) => !optional && value.trim() === '').length === 0;
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

        <form id="form" on:submit|preventDefault={handleRegistration}>
            {#each fields as field, i}
                {#if field.name === 'promo'}
                    <p class="info">
                        Si vous êtes étudiant, merci de renseigner votre promotion. Sinon, laissez ce champ vide.
                    </p>
                {/if}

                <div class="field-group">
                    <div class="label">
                        {field.label}
                        {#if !field.optional}
                            <span class="star">*</span>
                        {/if}
                    </div>
                    <input class="input" bind:value={field.value} readonly={registering} />
                </div>
            {/each}

            <div id="submit-container">
                <button id="submit" disabled={!canRegister || registering}>S'inscrire</button>
            </div>
        </form>
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

    .subtitle {
        margin: 17px 0;
    }

    .info .email {
        font-weight: bold;
    }

    #form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px 100px;

        margin-bottom: 5px;

        .field-group {
            flex-direction: column;

            .label {
                margin-left: 1px;
                margin-bottom: 5px;

                font-size: 14px;

                .star {
                    margin-left: 4px;

                    color: #e03721;
                }
            }
        }

        .info {
            margin: 5px 0;
            grid-column: span 2;
        }

        #submit-container {
            margin-top: 15px;
            grid-column: span 2;
        }

        #submit {
            background-color: wheat;
            color: black;

            font-size: 18px;
        }
    }
</style>
