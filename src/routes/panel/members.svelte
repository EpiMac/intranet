<script context="module">
    import { redirect } from '$lib/middleware';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ stuff: { user } }) {
        if (!user.is_admin)
        {
            return redirect('/panel');
        }

        return {};
    }
</script>

<script>
    let users = [
        { id: 0, email: 'john.doe@example.com', first_name: 'John', last_name: 'Doe', phone_number: '0612345678', promo: 2022, microsoft_email: 'john.doe@epita.fr' },
        { id: 1, email: 'jane.doe@example.com', first_name: 'Jane', last_name: 'Doe', phone_number: '0612345678', promo: 2023, microsoft_email: 'jane.doe@epita.fr' },
        { id: 2, email: 'john.doe@example.com', first_name: 'John', last_name: 'Doe', phone_number: '0612345678', promo: 2022, microsoft_email: 'john.doe@epita.fr' },
        { id: 3, email: 'jane.doe@example.com', first_name: 'Jane', last_name: 'Doe', phone_number: '0612345678', promo: 2023, microsoft_email: 'jane.doe@epita.fr' },
        { id: 4, email: 'john.doe@example.com', first_name: 'John', last_name: 'Doe', phone_number: '0612345678', promo: 2022, microsoft_email: 'john.doe@epita.fr' },
        { id: 5, email: 'jane.doe@example.com', first_name: 'Jane', last_name: 'Doe', phone_number: '0612345678', promo: 2023, microsoft_email: 'jane.doe@epita.fr' },
        { id: 6, email: 'john.doe@example.com', first_name: 'John', last_name: 'Doe', phone_number: '0612345678', promo: 2022, microsoft_email: 'john.doe@epita.fr' }
    ];

    const fields = [
        { name: 'id', label: 'ID' },
        { name: 'first_name', label: 'Prénom' },
        { name: 'last_name', label: 'Nom de famille' },
        { name: 'email', label: 'E-Mail' },
        { name: 'phone_number', label: 'Téléphone' },
        { name: 'microsoft_email', label: 'E-Mail IONIS' }
    ];
</script>

<!-- TODO: Pouvoir changer les infos -->

<div id="members" class="card">
    <h1>Liste des {users.length} membres</h1>

    <table class="list">
        <thead>
            <tr class="header">
                {#each fields as { label }}
                    <th>{label}</th>
                {/each}
            </tr>
        </thead>
        <tbody class="entries">
            {#each users as user, i}
                <tr class="entry" class:odd={i % 2}>
                    {#each fields as { name }}
                        <td>{user[name]}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
    $entry-horizontal-padding: 15px;

    #members {
        flex-direction: column;
    }

    .list {
        margin-top: 25px;
    }

    .header {
        border-bottom: solid 1px rgba(255, 255, 255, 0.75);

        * {
            text-align: left;
            padding-bottom: 10px;

            &:first-child {
                padding-left: $entry-horizontal-padding;
            }

            &:last-child {
                padding-right: $entry-horizontal-padding;
            }
        }
    }

    .entry {
        $border-radius: 4px;
        $vertical-padding: 10px;

        * {
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

        &:first-child * {
            padding-top: 10px + $vertical-padding;
        }

        &.odd * {
            background-color: rgba(255, 255, 255, 0.05);
        }
    }
</style>