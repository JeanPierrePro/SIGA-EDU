/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Isto cobre todas as pastas dentro de src
  ],
  theme: {
    extend: {
      // Aqui podes adicionar cores personalizadas para o SIGA EDU mais tarde
    },
  },
  plugins: [],
}