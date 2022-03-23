<script context="module">
    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ fetch, stuff: { user } }) {
        const files = await fetch('/panel/files.json').then(r => r.text());
        return {
            props: { files: {} }
        };
    }
</script>

<script>
    export let files;
</script>

<div class="files-container">
    <h1>Aucun fichier n'a été mis en ligne</h1>
    <p>
        {files}
    </p>
</div>

<style lang="scss">
    .files-container {
        flex-grow: 1;

        justify-content: center;
        align-items: center;
    }
</style>
