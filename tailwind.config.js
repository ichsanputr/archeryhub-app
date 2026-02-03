/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#D9FF00', // Neon Lime
                    hover: '#c2e600',
                },
                navy: {
                    dark: '#0f172a',
                    light: '#1e293b',
                    DEFAULT: '#0f172a',
                },
                "navy-dark": "#0f172a",
                "navy-light": "#1e293b",
                "text-main": "#111827",
                "text-secondary": "#6b7280",
                "text-nav": "#9ca3af",
                brand: {
                    gold: '#f9d006',
                    lime: '#D9FF00',
                },
                surface: {
                    white: '#ffffff',
                    light: '#f9fafb',
                    dark: '#0f172a',
                    highlight: '#1e293b', // Added highlight color
                },
                background: {
                    light: '#f9fafb',
                    dark: '#0f172a',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                reddit: ['Reddit Sans', 'sans-serif'],
                display: ['Lexend', 'sans-serif'],
                body: ['Noto Sans', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        function ({ addUtilities }) {
            addUtilities({
                '.scrollbar-hide': {
                    /* IE and Edge */
                    '-ms-overflow-style': 'none',
                    /* Firefox */
                    'scrollbar-width': 'none',
                    /* Safari and Chrome */
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }
            })
        }
    ],
    darkMode: 'class',
}
