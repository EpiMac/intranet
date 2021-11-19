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

    let fields = [
        { name: 'first_name', label: 'Prénom', value: user.first_name },
        { name: 'last_name', label: 'Nom de famille', value: user.last_name },
        { name: 'email', label: 'E-Mail', value: user.email },
        { name: 'phone_number', label: 'Numéro de téléphone', value: user.phone_number }
    ];

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

    <Form label="Éditer" endpoint="/panel/profile.json" {fields} on:posted={handleEdition}>
        <div class="submitted" slot="submit" in:fade={{ easing: cubicIn, duration: 100 }}>
            {#if submitted}
                􀁣 Modifications enregistrées
            {/if}
        </div>
    </Form>
</div>

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

    .edit {
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
</style>
