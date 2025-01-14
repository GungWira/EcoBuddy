/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor : {
        darkSoft: "#202020",
        darkMain: "#121212",
        greenMain : "#13F287"
      },
      colors : {
        darkSoft: "#202020",
        darkMain: "#121212",
        greenMain : "#13F287"
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

