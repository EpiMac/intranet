module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.svelte',
        './src/**/*.js'
    ],
    darkMode: 'media',
    theme: {
        extend: {
            backgroundOpacity: {
                '14': '0.14',
                '18': '0.18'
            }
        },
        fontFamily: {
            'sf-display': ['"SF Pro Display"', 'Arial', 'sans-serif'],
            'sf': ['"SF Pro Text"', 'Arial', 'sans-serif'],
            'sf-icons': ['"SF Pro Icons', 'Arial', 'sans-serif']
        }
    },
    variants: {
        extend: {
            backgroundOpacity: ['dark']
        },
    },
    plugins: [],
}
