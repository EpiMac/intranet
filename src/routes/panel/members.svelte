<script context="module">
    import { redirect } from '$lib/middleware';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ fetch, stuff: { user } }) {
        if (!user.is_admin) {
            return redirect('/panel');
        }

        return {
            props: {
                users: await fetch('/panel/members.json').then(r => r.json())
            }
        };
    }
</script>

<script>
    import { fade } from 'svelte/transition';

    import Form from '$components/Form.svelte';

    export let users;

    const fields = [
        { name: 'promo', label: 'Promotion', placeholder: 'Toutes', value: '', optional: true },
        { name: 'email_suffix', label: 'Suffixe d\'e-mail IONIS', placeholder: 'Tous', value: '', optional: true }
    ];

    const columns = [
        { name: 'id', label: 'ID' },
        { name: 'first_name', label: 'Prénom' },
        { name: 'last_name', label: 'Nom de famille' },
        { name: 'email', label: 'E-Mail' },
        { name: 'phone_number', label: 'Téléphone' },
        { name: 'microsoft_email', label: 'E-Mail IONIS' },
        { name: 'promo', label: 'Promotion' }
    ];

    let sort = { field: 'id', order: 'ascending' };
    let edited = null;

    function handleExport({ detail: params })
    {
        window.open(`/panel/members.csv?${new URLSearchParams(params).toString()}`, '_blank');
    }

    function toggleSort(field)
    {
        users = users.sort((a, b) => (a[field] || '').toString().localeCompare((b[field] || '').toString()));

        if (sort.field === field && sort.order === 'ascending') {
            sort.order = 'descending';
            users = users.reverse();
        } else {
            sort = { field, order: 'ascending' };
        }
    }

    function handleEdition({ detail: { user } })
    {
        users.forEach((u, i) => {
            if (u.id === user.id) {
                users[i] = user;
            }
        });

        edited = null;
    }

    $: editionFields = edited ? [
        { name: 'first_name', label: 'Prénom', value: edited.first_name },
        { name: 'last_name', label: 'Nom de famille', value: edited.last_name },
        { name: 'email', label: 'E-Mail', value: edited.email },
        { name: 'phone_number', label: 'Numéro de téléphone', value: edited.phone_number },
        { name: 'microsoft_email', label: 'E-Mail IONIS', value: edited.microsoft_email || '', optional: true },
        { name: 'promo', label: 'Promotion', value: edited.promo || '', optional: true }
    ] : [];
</script>

<div id="export" class="card">
    <h1>Exporter en CSV</h1>

    <Form label="Exporter" {fields} on:post={handleExport} autofocus={false}>

    </Form>
</div>

<div id="members" class="card">
    <h1>Liste des {users.length} membres</h1>

    <table class="list">
        <thead>
            <tr class="header">
                {#each columns as { name, label }}
                    <th class="case clickable" on:click={() => toggleSort(name)}>
                        {label}
                        <span class="sorting">
                            {#if sort.field === name}
                                {#if sort.order === 'ascending'}↓{:else}↑{/if}
                            {/if}
                        </span>
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody class="entries">
            {#each users as user, i}
                <tr class="entry clickable" class:odd={i % 2} on:click={() => edited = user}>
                    {#each columns as { name }}
                        <td class="case">{user[name] || '-'}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

{#if edited}
    <div class="modal card blurred" transition:fade={{ duration: 100 }}>
        <h1>Éditer un membre (#{edited.id})</h1>

        Mettre le champ "E-Mail IONIS" ou "Promotion" vide supprimera le champ du profil de l'utilisateur.

        <Form label="Éditer" endpoint="/panel/edit-user.json" fields={editionFields} on:posted={handleEdition} extraData={{ id: edited.id }} />

        <button class="cancel" on:click={() => edited = null}>Annuler</button>
    </div>
{/if}

<style lang="scss">
    $entry-horizontal-padding: 15px;

    #export {
        h1 {
            margin-bottom: 25px;
        }

        flex-direction: column;

        margin-bottom: 30px;
    }

    #members {
        flex-direction: column;
    }

    .list {
        margin-top: 25px;
    }

    .header {
        user-select: none;
        border-bottom: solid 1px rgba(255, 255, 255, 0.75);

        .case {
            text-align: left;
            padding-bottom: 10px;

            &:first-child {
                padding-left: $entry-horizontal-padding;
            }

            &:last-child {
                padding-right: $entry-horizontal-padding;
            }

            .sorting {
                display: inline-block;
                width: 0;
            }
        }
    }

    .entry {
        $border-radius: 4px;
        $vertical-padding: 10px;

        .case {
            padding: $vertical-padding 0;

            &:first-child {
                border-top-left-radius: $border-radius;
                border-bottom-left-radius: $border-radius;
                padding-left: $entry-horizontal-padding;
            }

            &:last-child {
                border-top-right-radius: $border-radius;
                border-bottom-right-radius: $border-radius;
                padding-right: $entry-horizontal-padding;
            }
        }

        &:first-child .case {
            padding-top: 10px + $vertical-padding;
        }

        &.odd .case {
            background-color: rgba(255, 255, 255, 0.05);
        }
    }

    :global(#content) {
        position: relative;
    }

    .modal {
        position: absolute;

        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        flex-direction: column;

        border-radius: 0;
        background-color: rgba(20, 20, 20, .85); // TODO: Remove this when firefox supports backdrop-filter

        h1 {
            margin-bottom: 20px;
        }

        :global(.form) {
            margin-top: 25px;
        }

        .cancel {
            margin-top: 25px;
        }
    }
</style>
