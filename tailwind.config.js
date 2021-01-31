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
                '18': '0.18'
            }
        },
        fontFamily: {
            'sf-compact-display': ['"SF Compact Display"', 'Arial', 'sans-serif'],
            'sf-compact': ['"SF Compact Text"', 'Arial', 'sans-serif'],
            'sf-display': ['"SF Pro Display"', 'Arial', 'sans-serif'],
            'sf': ['"SF Pro Text"', 'Arial', 'sans-serif']
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
