/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4D6DE3",
        secondary: "#393737",
        bgcolor:'#F1FCFD'
      },
      fontFamily: {
        'sans': ["Michroma","Inter", "sans-serif"],
        'poppins': ['Poppins', 'sans-serif']
      },
    },
  },
  plugins: [require("daisyui")],
}