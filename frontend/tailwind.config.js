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
        kmrl: {
          bg: '#070B14',
          surface: '#0D1526',
          panel: '#131E35',
          border: '#1E2D4A',
          hover: '#192846',
          primary: '#00D2FF',
          accent: '#0077B6',
          cyan: '#38BDF8',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(0, 210, 255, 0.5)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 5px rgba(0, 210, 255, 0.2)' },
        },
      },
    },
  },
  plugins: [],
}
