/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0052FF', // Base blue
                secondary: '#00D4AA', // Accent green
            }
        },
    },
    plugins: [],
}
