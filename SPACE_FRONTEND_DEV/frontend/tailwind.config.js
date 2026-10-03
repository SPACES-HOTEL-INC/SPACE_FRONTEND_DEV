/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Executive corporate palette
        canvas: '#f8fafc', // off-white app background
        ink: '#0f172a', // dark slate primary text / dark surfaces
        line: '#cbd5e1', // subtle borders
        // Deep Teal — primary action colour (600 = #0f766e)
        brand: {
          50: '#effefb',
          100: '#c9fdf3',
          200: '#93f9e8',
          300: '#55eeda',
          400: '#25d6c4',
          500: '#0fb9aa',
          600: '#0f766e',
          700: '#0d605a',
          800: '#0f4c48',
          900: '#113f3c',
          950: '#032824',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.12)',
        'card-lg': '0 10px 40px -12px rgba(15,23,42,0.18)',
        panel: '0 30px 60px -20px rgba(2,40,36,0.55)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        rise: 'rise 0.5s cubic-bezier(0.2,0.7,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'toast-in': 'toast-in 0.35s cubic-bezier(0.2,0.7,0.3,1) both',
      },
    },
  },
  plugins: [],
}
