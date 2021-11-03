<script context="module">
    import { redirect } from '$lib/middleware';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load() {
        return redirect('/panel/profile', true);
    }
</script>
