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
        // Light mode colors
        light: {
          primary: '#FFFFFF',
          secondary: '#F8F9FA',
          tertiary: '#F1F3F4',
          text: {
            primary: '#1A1A1A',
            secondary: '#6B7280',
            muted: '#9CA3AF',
          },
          accent: '#000000',
          border: '#E5E7EB',
          shadow: 'rgba(0, 0, 0, 0.1)',
        },
        // Dark mode colors
        dark: {
          primary: '#0F0F0F',
          secondary: '#1A1A1A',
          tertiary: '#2D2D2D',
          text: {
            primary: '#FFFFFF',
            secondary: '#A1A1AA',
            muted: '#71717A',
          },
          accent: '#FFFFFF',
          border: '#2D2D2D',
          shadow: 'rgba(255, 255, 255, 0.1)',
        },
        // Semantic colors for both modes
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
        info: {
          light: '#2563EB',
          dark: '#3B82F6',
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
        'light': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'light-md': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'light-lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'dark': '0 1px 3px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(255, 255, 255, 0.06)',
        'dark-md': '0 4px 6px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.06)',
        'dark-lg': '0 10px 15px rgba(255, 255, 255, 0.1), 0 4px 6px rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};