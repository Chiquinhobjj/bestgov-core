/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/design/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#20639B", // versão simplificada sem objeto para máxima compatibilidade
        "primary-dark": "#173F5F",
        accent: "#3CAEA3",
        highlight: "#D4AF37",
      },
    },
  },
  plugins: [],
};