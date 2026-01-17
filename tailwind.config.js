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
                    DEFAULT: '#f9d406',
                    dark: '#e6c205',
                    light: '#fade44',
                },
                brand: {
                    gold: '#f9d006',
                    border: '#4a4321',
                    surface: '#2d2814',
                },
                surface: {
                    dark: '#2d2814',
                    highlight: '#353018',
                },
                background: {
                    dark: '#231f0f',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                reddit: ['Reddit Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}
