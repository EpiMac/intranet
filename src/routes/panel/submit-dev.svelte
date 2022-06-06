<script context="module">
    import { redirect } from '$lib/middleware';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ fetch, stuff: { user } }) {
        if (!user.microsoft_email || !user.promo) {
            return redirect('/panel/perks');
        }

        return {};
    }
</script>

<script>
    import Form from '$components/Form.svelte';

    let submitted = false;
    const fields = [
        { name: 'email', label: 'E-Mail du compte Apple auquel ajouter la license', value: '', long: true },
        { name: 'reason', type: 'textarea', label: 'Pourquoi avez-vous besoin de la license ?', value: '', long: true }
    ];
</script>

<h1 class="title">Demande de license Apple Developer</h1>

{#if !submitted}
    <div class="form card">
        <h1>Formulaire de demande</h1>

        <Form label="Envoyer" endpoint="/panel/submit-dev.json" fields={fields} on:posted={() => submitted = true}>
            <div class="conditions" slot="submit">
                En cliquant sur 'Envoyer' vous acceptez les&nbsp;<a class="link" href="https://www.epimac.org/mentions-legales/" target="_blank">conditions générales</a>
                &nbsp;liées à la licence Apple Developer
            </div>
        </Form>
    </div>
{:else}
    Demande envoyée !
    <a href="/panel/perks" sveltekit:prefetch><button class="back">Retour</button></a>
{/if}

<style lang="scss">
    .title {
        margin-bottom: 25px;
    }

    .form {
        flex-direction: column;

        h1 {
            margin-bottom: 25px;
        }
    }

    .back {
        margin-top: 20px;
    }

    .conditions {
        margin-left: 25px;
        align-items: center;

        .link {
            text-decoration: underline;
        }
    }
</style>