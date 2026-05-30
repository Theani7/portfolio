/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Editorial "warm paper" system. md-* names kept so all components adopt it.
                md: {
                    background: '#F7F5F0',
                    'on-background': '#1A1714',
                    surface: '#FFFFFF',
                    'surface-variant': '#ECEAE3',
                    primary: '#1A1714',
                    'on-primary': '#F7F5F0',
                    'secondary-container': '#ECEAE3',
                    'on-secondary-container': '#1A1714',
                    tertiary: '#B54A2E',
                    'on-tertiary': '#FFFFFF',
                    outline: '#DBD8CF',
                    'on-surface-variant': '#6F6A60',
                },
                accent: '#B54A2E',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Fraunces', 'Georgia', 'serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
            },
            borderRadius: {
                'md-xs': '6px',
                'md-sm': '10px',
                'md-md': '14px',
                'md-lg': '18px',
                'md-xl': '24px',
                'md-2xl': '28px',
                'md-3xl': '36px',
            },
            boxShadow: {
                'md-elevation-1': '0 1px 2px 0 rgb(26 23 20 / 0.04)',
                'md-elevation-2': '0 8px 24px -12px rgb(26 23 20 / 0.12)',
                'md-elevation-3': '0 18px 50px -20px rgb(26 23 20 / 0.18)',
            },
        },
    },
    plugins: [],
}
