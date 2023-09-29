/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ntr: ['NTR', 'sans-serif'], // เพิ่มฟอนต์ Roboto และกำหนดให้เป็นฟอนต์แสนเซริฟ (sans-serif)
        mitr: ['Mitr', 'sans-serif' ],
      },

    },
  },
  plugins: [],
}