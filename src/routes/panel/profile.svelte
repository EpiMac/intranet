<script context="module">
    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ stuff: { user, submitted } }) {
        return {
            props: { user, submitted }
        };
    }
</script>

<script>
    import { cubicIn } from 'svelte/easing';
    import { fade } from 'svelte/transition';

    import { session } from '$app/stores';

    import Form from '$components/Form.svelte';

    export let user;
    export let submitted;

    const fields = [
        { name: 'first_name', label: 'Prénom', value: user.first_name },
        { name: 'last_name', label: 'Nom de famille', value: user.last_name },
        { name: 'email', label: 'E-Mail', value: user.email },
        { name: 'phone_number', label: 'Numéro de téléphone', value: user.phone_number }
    ];

    const passwordFields = [
        { name: 'old_password', type: 'password', label: 'Mot de passe actuel', value: '', long: true },
        { name: 'password', type: 'password', label: 'Nouveau mot de passe', value: '', confirmedBy: 'password_confirm' },
        { name: 'password_confirm', type: 'password', label: 'Confirmation du nouveau mot de passe', value: '', confirms: 'password' }
    ];

    let passwordEdited = false;

    function handleEdition({ detail: { user: u } })
    {
        // This will trigger a soft-reload of the page sometimes
        session.update(s => ({ ...s, user: u, submitted: true }));

        // But sometimes not, so...
        submitted = true;
        user = u;
    }
</script>

<div class="header">
    <div class="avatar">{user.first_name[0]}</div>
    <div class="name">{user.first_name} {user.last_name}</div>
    <div class="email">{user.email}</div>
</div>

<div class="edit card">
    <h1>Éditer son profil</h1>

    <Form label="Sauvegarder" endpoint="/panel/profile.json" {fields} on:posted={handleEdition} autofocus={false}>
        <div class="submitted" slot="submit" in:fade={{ easing: cubicIn, duration: 100 }}>
            {#if submitted}
                􀁣 Modifications enregistrées
            {/if}
        </div>
    </Form>
</div>

{#if !user.with_apple}
    <div class="password card">
        <h1>Changer de mot de passe</h1>

        <Form label="Changer" endpoint="/panel/set-password.json" fields={passwordFields} on:posted={() => passwordEdited = true}>
            <div class="submitted" slot="submit" in:fade={{ easing: cubicIn, duration: 100 }}>
                {#if passwordEdited}
                    􀁣 Mot de passe mis à jour
                {/if}
            </div>
        </Form>
    </div>
{/if}

<style lang="scss">
    @import 'vars';

    .header {
        flex-direction: column;
        align-items: center;

        margin: 75px 0;

        .avatar {
            justify-content: center;
            align-items: center;

            width: 160px;
            height: 160px;

            font-family: $font-sf-display;
            font-weight: 600;
            font-size: 62px;

            background-color: rgb(55, 65, 81);

            border-radius: 50%;
        }

        .name {
            margin-top: 25px;

            font-weight: 700;
            font-size: 30px;
        }

        .email {
            font-size: 20px;
        }
    }

    .edit, .password {
        flex-direction: column;

        h1 {
            margin-bottom: 25px;
        }
    }

    :global(.form) {
        grid-gap: 15px 150px !important;
    }

    :global(.submit-container) {
        margin-top: 20px;
    }

    .submitted {
        align-items: center;

        margin-left: 15px;
    }

    .password {
        margin-top: 25px;
    }
</style>
