<script>
    let state = 'A';
    let next = 'A';
    let swapping = false;

    function toggle()
    {
        if (swapping) {
            return;
        }

        swapping = true;
        state = null;
        next = next === 'A' ? 'B' : 'A';
    }

    function outro()
    {
        state = next;
        swapping = false;
    }
</script>

{#if state === 'A'}
    <slot name="A" {toggle} {outro}></slot>
{/if}
{#if state === 'B'}
    <slot name="B" {toggle} {outro}></slot>
{/if}
