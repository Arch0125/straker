/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
        
"primary": "#4D6DE3",
        
"secondary": "#C7EEFF",
        
"accent": "#F1FCFD",
        
"neutral": "#393737",
        
"base": "#F1FCFD",
        
"info": "#3ABFF8",
        
"success": "#36D399",
        
"warning": "#FBBD23",
        
"error": "#F87272",
        },
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        primary: "#4D6DE3",
        secondary: "#C7EEFF",
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