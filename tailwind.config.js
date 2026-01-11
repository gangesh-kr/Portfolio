/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'charcoal': '#121212',
                'gold': '#D4AF37',
                'whitesmoke': '#F5F5F5',
                'neon-gold': '#FFD700',
                'glass': 'rgba(255, 255, 255, 0.05)'
            },
            fontFamily: {
                'sans': ['Inter Tight', 'sans-serif'],
                'mono': ['Space Mono', 'monospace']
            }
        },
    },
    plugins: [],
}
