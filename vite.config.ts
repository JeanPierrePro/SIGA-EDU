import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite' <--- COMENTA ISTO

export default defineConfig({
  plugins: [
    react(),
    // tailwindcss(), <--- COMENTA ISTO
  ],
})