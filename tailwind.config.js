module.exports = {
    purge: {
        content: [
            './src/**/*.html',
            './src/**/*.svelte',
            './src/**/*.js'
        ],
        options: {
            safelist: ['bg-img-base', 'bg-img-light', 'bg-green-yes', 'bg-green-no']
        }
    },
    darkMode: 'media',
    theme: {
        extend: {
            backgroundOpacity: {
                '14': '0.14',
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
