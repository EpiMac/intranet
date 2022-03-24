<script context="module">
    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ fetch }) {
        const files = await fetch('/panel/files.json').then(r => r.json());
        return {
            props: { files }
        };
    }
</script>

<script>
    export let files;

    function openFile({ id })
    {
        window.open(`/panel/file/${id}`, '_blank');
    }
</script>

<h1>Documents</h1>

<div class="files">
    {#each files as file}
        <div class="file card clickable" on:click={() => openFile(file)}>
            􀈸
            <span class="name">{file.name}</span>
        </div>
    {/each}
</div>

<style lang="scss">
    .files {
        margin-top: 35px;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 25px 50px;
    }

    .file .name {
        margin-left: 25px;
    }
</style>
