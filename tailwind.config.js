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
                    DEFAULT: 'rgb(var(--primary-rgb, 217 255 0) / <alpha-value>)',
                    hover: 'var(--primary-hover, #c2e600)',
                    text: 'var(--primary-text, #0f172a)',
                },
                navy: {
                    dark: 'rgb(var(--sidebar-bg-rgb, 15 23 42) / <alpha-value>)',
                    light: '#1e293b',
                    DEFAULT: 'rgb(var(--sidebar-bg-rgb, 15 23 42) / <alpha-value>)',
                },
                "navy-dark": "rgb(var(--sidebar-bg-rgb, 15 23 42) / <alpha-value>)",
                "navy-light": "#1e293b",
                "text-main": "#111827",
                "text-secondary": "#6b7280",
                "text-nav": "#9ca3af",
                brand: {
                    gold: '#f9d006',
                    lime: '#D9FF00',
                },
                surface: {
                    white: 'rgb(var(--header-bg-rgb, 255 255 255) / <alpha-value>)',
                    light: '#f9fafb',
                    dark: 'rgb(var(--sidebar-bg-rgb, 15 23 42) / <alpha-value>)',
                    highlight: '#1e293b',
                },
                background: {
                    light: '#f9fafb',
                    dark: 'rgb(var(--sidebar-bg-rgb, 15 23 42) / <alpha-value>)',
                },
                header: {
                    bg: 'rgb(var(--header-bg-rgb, 255 255 255) / <alpha-value>)',
                    text: 'var(--header-text, #0f172a)',
                },
                btn: {
                    // Text color for buttons with LIGHT backgrounds (e.g. primary/lime)
                    text: 'var(--btn-text, #0f172a)',
                    // Text color for buttons with DARK backgrounds (e.g. navy)
                    inverse: 'var(--btn-text-inverse, #D9FF00)',
                }
            },
            fontFamily: {
                sans: ['NovaText', 'sans-serif'],
                display: ['Bricolage Grotesque', 'sans-serif'],
                body: ['NovaText', 'sans-serif'],
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
