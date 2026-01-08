import tailwindForms from '@tailwindcss/forms';
import tailwindContainerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
        colors: {
            "primary": "#C5A059", /* Accent Gold */
            "secondary": "#1A2530", /* Deep Charcoal/Blue */
            "background-light": "#F9F9F7", /* Warm Ivory */
            "background-dark": "#1A1810",
            "text-dark": "#1A2530", /* Main Text */
            "text-muted": "#606060",
            "text-light": "#F9F9F7", 
            "accent-light": "#E5C585",
        },
        fontFamily: {
            "display": ["Pretendard", "Noto Sans KR", "Nanum Gothic", "sans-serif"],
            "serif": ["Noto Serif KR", "Pretendard", "Nanum Gothic", "serif"], 
            "body": ["Pretendard", "Noto Sans KR", "Nanum Gothic", "sans-serif"], 
        },
        lineHeight: {
            'loose': '1.8',
            'extra-loose': '2.2',
        },
        animation: {
            'fade-in-up': 'fadeInUp 1s ease-out forwards',
            'fade-in': 'fadeIn 1.5s ease-out forwards',
            'bounce-slow': 'bounceSlow 3s infinite',
            'message-in': 'messageIn 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            'pulse-gentle': 'pulseGentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
            fadeInUp: {
                '0%': { opacity: '0', transform: 'translateY(20px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
            },
            fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
            },
            bounceSlow: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
            },
            messageIn: {
                '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
                '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
            },
            pulseGentle: {
                '0%, 100%': { opacity: '1' },
                '50%': { opacity: '0.6' },
            }
        }
    },
  },
  plugins: [
    tailwindForms,
    tailwindContainerQueries,
  ],
}