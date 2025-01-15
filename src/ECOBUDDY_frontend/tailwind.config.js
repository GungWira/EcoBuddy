/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        darkSoft: "#202020",
        darkMain: "#121212",
        greenMain: "#13F287",
      },
      colors: {
        darkSoft: "#202020",
        darkMain: "#121212",
        greenMain: "#13F287",
        whiteSoft: "#707070",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        mainBackground: "url('/home/background.svg')",
        aboutBackground: "url('/home/background-about.svg')",
        shine: "linear-gradient(to right, #202020 0%, #13F287 100% 0%)",
        greenGradient: "linear-gradient(to right, #13F287 0%, #0B8C4E 100%)",
        darkGradient: "linear-gradient(to right, #202020 0%, #1A1A1A 100%)",
      },
      backgroundSize: {
        4: "3.5rem",
      },
      borderImage: {
        shine: "linear-gradient(to right, #202020 100%, #13F287 5% 40%)", // Tidak langsung digunakan sebagai borderColor
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        slide: "slide 25s linear infinite", // 2s adalah durasi animasi
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%",
        5: "5 5 0%",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
