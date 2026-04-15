/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                md: {
                    background: '#FFFBFE',
                    'on-background': '#1C1B1F',
                    surface: '#F3EDF7',
                    'surface-variant': '#E7E0EC',
                    primary: '#6750A4',
                    'on-primary': '#FFFFFF',
                    'secondary-container': '#E8DEF8',
                    'on-secondary-container': '#1D192B',
                    tertiary: '#7D5260',
                    'on-tertiary': '#FFFFFF',
                    outline: '#79747E',
                    'on-surface-variant': '#49454F',
                },
            },
            fontFamily: {
                sans: ['Roboto', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'md-xs': '8px',
                'md-sm': '12px',
                'md-md': '16px',
                'md-lg': '24px',
                'md-xl': '28px',
                'md-2xl': '32px',
                'md-3xl': '48px',
            },
            boxShadow: {
                'md-elevation-1': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'md-elevation-2': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'md-elevation-3': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
        },
    },
    plugins: [],
}
