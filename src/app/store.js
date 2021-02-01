import { writable } from 'svelte/store';

export const page = writable('EpiMac Intranet');
export const user = writable(null);
export const isLinked = writable(false);
