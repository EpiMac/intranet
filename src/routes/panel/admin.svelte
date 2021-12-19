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

WIP