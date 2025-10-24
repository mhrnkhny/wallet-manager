/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F1419',
          card: '#1A1D2E',
          surface: '#262A3F',
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        secondary: {
          50: '#E0F2F1',
          100: '#B2DFDB',
          200: '#80CBC4',
          300: '#4DB6AC',
          400: '#26A69A',
          500: '#009688',
          600: '#00897B',
          700: '#00796B',
          800: '#00695C',
          900: '#004D40',
        },
        success: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          500: '#4CAF50',
          700: '#388E3C',
        },
        warning: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          500: '#FF9800',
          700: '#F57C00',
        },
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
        },
        info: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          500: '#2196F3',
          700: '#1976D2',
        },
        accent: {
          pink: '#F472B6',
          purple: '#A78BFA',
          blue: '#60A5FA',
        },
      },
      fontFamily: {
        sans: ['Vazir', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
      animation: {
        'slide-up': 'slide-up 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      keyframes: {
        'slide-up': {
          from: {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: {
            transform: 'scale(0.95)',
            opacity: '0',
          },
          to: {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}
