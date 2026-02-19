/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sea: {
                    dark: '#0A1628',   // Deep Maritime Blue (Nuit en mer)
                    light: '#E8F4FD',  // Blanc bleuté (Text primary)
                    cyan: '#00D4FF',   // Cyan électrique (CTA/Accents)
                    blue: '#0099CC',   // Soft accent
                    border: '#1A3A6B', // Maritime border
                    green: '#00E5A0',
                    red: '#FF4D6A',
                }
            },
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                dm: ['DM Sans', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in-left': {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'fade-in-right': {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                }
            },
            animation: {
                'fade-in': 'fade-in 1s ease-out forwards',
                'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
                'fade-in-left': 'fade-in-left 1s ease-out forwards',
                'fade-in-right': 'fade-in-right 1s ease-out forwards',
            }
        },
    },
    plugins: [],
}
