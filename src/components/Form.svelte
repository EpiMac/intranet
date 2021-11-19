<script>
    // TODO: Better validation
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let label;
    export let endpoint;
    export let fields;

    let submitting = false;

    function submit()
    {
        if (submitting) {
            return;
        }

        submitting = true;

        const data = {};
        for (const { name, value } of fields) {
            if (value.trim() !== '') {
                data[name] = value;
            }
        }

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(r => r.json()).then(result => {
            dispatch('posted', result);
            submitting = false;
        }).catch(err => console.error(err));
    }

    $: canSubmit = fields.filter(({ value, optional }) => !optional && value.trim() === '').length === 0;
</script>

<form class="form" on:submit|preventDefault={submit}>
    {#each fields as field}
        <slot name="field" {field} />

        <div class="field-group">
            <div class="label">
                {field.label}
                {#if !field.optional}
                    <span class="star">*</span>
                {/if}
            </div>
            <input class="input" bind:value={field.value} readonly={submitting} />
        </div>
    {/each}

    <div class="submit-container">
        <button class="submit" disabled={!canSubmit || submitting}>{label}</button>
        <slot name="submit" />
    </div>
</form>

<style lang="scss">
    .form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px 100px;

        margin-bottom: 5px;
    }

    .field-group {
        flex-direction: column;

        .label {
            margin-left: 1px;
            margin-bottom: 5px;

            font-size: 14px;

            .star {
                margin-left: 4px;

                color: #e03721;
            }
        }
    }

    .submit-container {
        margin-top: 15px;
        grid-column: span 2;

        .submit {
            background-color: wheat;
            color: black;

            font-size: 18px;
        }
    }
</style>