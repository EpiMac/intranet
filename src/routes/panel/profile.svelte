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
    // TODO: Generify with register.svelte

    import { session } from '$app/stores';

    export let user;

    let applying = false;
    let fields = [
        { name: 'first_name', label: 'Prénom', value: user.first_name },
        { name: 'last_name', label: 'Nom de famille', value: user.last_name },
        { name: 'email', label: 'E-Mail', value: user.email },
        { name: 'phone_number', label: 'Numéro de téléphone', value: user.phone_number }
    ];

    function handleEdition()
    {
        if (applying) {
            return;
        }

        applying = true;

        const data = {};
        for (const { name, value } of fields) {
            if (value.trim() !== '') {
                data[name] = value;
            }
        }

        fetch('/panel/profile.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(r => r.json()).then(({ user }) => {
            // This will trigger a soft-reload of the page
            session.update(s => ({ ...s, user }));
        }).catch(err => console.error(err));
    }

    $: canApply = fields.filter(({ value, optional }) => !optional && value.trim() === '').length === 0;
</script>

<div class="header">
    <div class="avatar">{user.first_name[0]}</div>
    <div class="name">{user.first_name} {user.last_name}</div>
    <div class="email">{user.email}</div>
</div>

<div class="edit card">
    <h1>Éditer son profil</h1>

    <form id="form" on:submit|preventDefault={handleEdition}>
        {#each fields as field, i}
            <div class="field-group">
                <div class="label">
                    {field.label}
                    {#if !field.optional}
                        <span class="star">*</span>
                    {/if}
                </div>
                <input class="input" bind:value={field.value} readonly={applying} />
            </div>
        {/each}

        <div id="submit-container">
            <button id="submit" disabled={!canApply || applying}>Éditer</button>
        </div>
    </form>
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

    #form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px 150px;

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

        #submit-container {
            margin-top: 15px;
            grid-column: span 2;
        }

        #submit {
            margin-top: 5px;

            background-color: wheat;
            color: black;

            font-size: 18px;
        }
    }
</style>
