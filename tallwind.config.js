/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {animation: {
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        rotateSlow: 'rotateSlow 12s linear infinite',
        scalePulse: 'scalePulse 4s ease-in-out infinite',
        driftHorizontal: 'driftHorizontal 8s ease-in-out infinite alternate',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        driftHorizontal: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(20px)' },
        },
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-custom": "linear-gradient(to right, #3b82f6, #d946ef)",
      },
      colors: {
        primary: "rgba(79, 209, 197, 1)",
      },
    },
  },
  plugins: [],
};
