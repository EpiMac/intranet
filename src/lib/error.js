import { writable } from 'svelte/store';

export const error = writable(null);
export const errorDisplayed = writable(false);

let timeout = null;

export function displayError(message)
{
    error.set(message);
    errorDisplayed.set(true);

    if (timeout) {
        clearTimeout(timeout);
    }

    timeout = setTimeout(() => errorDisplayed.set(false), 5000);
}
