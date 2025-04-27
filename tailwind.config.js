module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./projects/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))', // Kluczowa zmiana
      },
      colors: { // Dodaję kolory gradientu do palety
        indigo: {
          600: '#4f46e5',
        },
        purple: {
          700: '#7c3aed',
        }
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.05' }
        }
      },
      animation: {
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: [],
}