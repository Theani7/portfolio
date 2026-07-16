/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                md: {
                    background: 'var(--md-background)',
                    'on-background': 'var(--md-on-background)',
                    surface: 'var(--md-surface)',
                    'surface-variant': 'var(--md-surface-variant)',
                    primary: 'var(--md-primary)',
                    'on-primary': 'var(--md-on-primary)',
                    'secondary-container': 'var(--md-surface-variant)',
                    'on-secondary-container': 'var(--md-on-background)',
                    tertiary: 'var(--accent)',
                    'on-tertiary': 'var(--md-background)',
                    outline: 'var(--md-outline)',
                    'on-surface-variant': 'var(--md-on-surface-variant)',
                },
                accent: 'var(--accent)',
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
