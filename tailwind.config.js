/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Professional Blue-based Design System
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93BBFC',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Light mode colors
        light: {
          primary: '#FFFFFF',
          surface: '#F8FAFC',
          background: '#FFFFFF',
          text: {
            primary: '#0F172A',
            secondary: '#64748B',
            muted: '#94A3B8',
          },
          border: '#E2E8F0',
          shadow: 'rgba(0, 0, 0, 0.1)',
        },
        // Dark mode colors
        dark: {
          primary: '#0F172A',
          surface: '#1E293B',
          background: '#0F172A',
          text: {
            primary: '#F8FAFC',
            secondary: '#CBD5E1',
            muted: '#94A3B8',
          },
          border: '#334155',
          shadow: 'rgba(0, 0, 0, 0.3)',
        },
        // Semantic colors
        success: {
          light: '#059669',
          dark: '#10B981',
        },
        warning: {
          light: '#D97706',
          dark: '#F59E0B',
        },
        error: {
          light: '#DC2626',
          dark: '#EF4444',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        'typing': 'typing 1s steps(20) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-2px)' },
          '60%': { transform: 'translateY(-1px)' },
        },
        typing: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
      boxShadow: {
        'light': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'light-md': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'light-lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'dark': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
        'dark-lg': '0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};