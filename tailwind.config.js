/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#e8eef8',
          100: '#c5d3ef',
          200: '#9eb5e4',
          300: '#7796d9',
          400: '#5a7fd1',
          500: '#3d68c8',
          600: '#2f55b0',
          700: '#1e3d8a',
          800: '#132965',
          900: '#0a1840',
          950: '#060c22',
        }
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, #060c22 0%, #0d1b3e 40%, #091428 70%, #060c22 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(13,27,64,0.8) 0%, rgba(9,20,40,0.9) 100%)',
        'accent-gradient': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
        'glow-gradient': 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59,130,246,0.4)',
        'glow-lg': '0 0 40px rgba(59,130,246,0.3)',
        'card': '0 4px 32px rgba(0,0,0,0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 20px rgba(59,130,246,0.4)' }, '50%': { boxShadow: '0 0 40px rgba(59,130,246,0.7)' } }
      }
    }
  },
  plugins: []
}