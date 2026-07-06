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
        primary: {
          50: '#fdf8f1',
          100: '#f9ead4',
          200: '#f3d5a9',
          300: '#ecc07e',
          400: '#e5ab53',
          500: '#d49628',  // Golden
          600: '#bf7f20',
          700: '#9f6618',
          800: '#7f4d10',
          900: '#5f3308',
        },
        accent: {
          50: '#f5f3f0',
          100: '#e8e2d9',
          200: '#d1c5b3',
          300: '#baa88d',
          400: '#a38b67',
          500: '#8c6e41',  // Beige
          600: '#705734',
          700: '#544027',
          800: '#38291a',
          900: '#1c120d',
        }
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}