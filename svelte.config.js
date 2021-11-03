import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        target: '#app',
        adapter: adapter({
            precompress: true
        }),
        vite: () => ({
            resolve: {
                alias: {
                    // The 'replace' values in the preprocess options should work when using /components, but for
                    // some reason it doesn't work on the first build when importing Svelte components.
                    // I'm using this instead until the issue is fixed.
                    '$components': '/src/components'
                }
            }
        })
    },
    preprocess: preprocess({
        replace: [
            [/import '\//g, "import '/src/"],
            [/from '\//g, "from '/src/"]
        ],
        sourceMap: true,
        scss: {
            renderSync: true,
            includePaths: ['src/styles']
        }
    })
};

export default config;
