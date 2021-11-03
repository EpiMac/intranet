<script context="module">
    import { redirect } from '$lib/middleware';

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ session }) {
        const { user } = session || {};
        return redirect(user ? (user.first_name ? '/panel' : '/auth/register') : '/auth/login');
    }
</script>
