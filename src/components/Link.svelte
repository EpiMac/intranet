<script>
    export let to = '/';
    export let external = true;

    $: params = to.startsWith('http')
            ? { rel: 'external', ...(external ? { target: '_blank' } : {}) }
            : { 'sveltekit:prefetch': true };
</script>

<a class="link" href={to} {...params}>
    <slot />
</a>
