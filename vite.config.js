import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 1200, // 👈 Change this to your desired port
  },
  build: {
    minify: true,
    sourcemap: false,
  },
})
