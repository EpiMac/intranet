<script>
    import { createEventDispatcher } from 'svelte';

    import { displayError } from '$lib/error.js';

    // TODO: Better validation

    const dispatch = createEventDispatcher();

    export let label;
    export let endpoint;
    export let fields;
    export let autofocus = true;
    export let extraData = {};

    let submitting = false;

    function submit()
    {
        if (submitting) {
            return;
        }

        submitting = true;

        const data = { ...extraData };
        for (const { name, value } of fields) {
            if (value.trim() !== '') {
                data[name] = value;
            }
        }

        dispatch('post', data);

        if (!endpoint) {
            submitting = false;
            return;
        }

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(r => r.json()).then(result => {
            const { error } = result;
            if (error) {
                console.error(error);
                displayError(error);
            } else {
                dispatch('posted', result);
            }

            submitting = false;
        }).catch(err => {
            console.error(err);
            displayError(err.toString());

            submitting = false;
        });
    }

    $: canSubmit = fields.filter(({ value, optional }) => !optional && value.trim() === '').length === 0;
</script>

<form class="form" on:submit|preventDefault={submit}>
    {#each fields as field, i}
        <slot name="field" {field} />

        <div class="field-group" class:long={field.long}>
            <div class="label">
                {field.label}
                {#if !field.optional}
                    <span class="star">*</span>
                {/if}
            </div>

            <!-- Type can't be dynamic if input uses two-way binding -->
            {#if field.type === 'password'}
                <input class="input" type="password" bind:value={field.value} readonly={submitting} />
            {:else}
                <input class="input" bind:value={field.value} placeholder={field.placeholder} readonly={submitting} autofocus={autofocus && i === 0} />
            {/if}
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

        &.long {
            grid-column: span 2;
        }
    }

    .submit-container {
        margin-top: 15px;
        grid-column: span 2;

        .submit {
            background-color: white;
            color: black;

            font-size: 18px;
        }
    }
</style>
