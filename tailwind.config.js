/* */
export default {
  content: [
    "./frontend/**/*.{js,jsx,ts,tsx}",
    "./frontend/index.html",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#FD6A05',
        brandlight: '#FE7B23',
        black: '#0A0A0A',
        gray1: '#F3F3F3',
        gray2: '#646464',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} 