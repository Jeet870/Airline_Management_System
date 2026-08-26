/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ops: {
          bg: '#0B1220',
          secondaryBg: '#101927',
          workspace: '#131E2C',
          panel: '#172334',
          elevated: '#1B2A3C',
          mapBg: '#0E1826',
          border: '#26384B',
          strongBorder: '#344A60',
          subtleBorder: '#1D2C3D',
          primaryText: '#F3F7FA',
          secText: '#A7B5C4',
          mutedText: '#718296',
        },
        accent: {
          DEFAULT: '#36C5E8',
          cyan: '#36C5E8',
          blue: '#4B8DFF',
          green: '#35C98B',
          amber: '#F4B84A',
          red: '#F06472',
          purple: '#9C7BFF',
        },
        status: {
          success: '#35C98B',
          warning: '#F4B84A',
          danger: '#F06472',
          info: '#4B8DFF',
          neutral: '#718296',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'airplane-fly': 'airplane-fly 15s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.6))' },
          '50%': { opacity: 0.5, filter: 'drop-shadow(0 0 2px rgba(0, 240, 255, 0.2))' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
