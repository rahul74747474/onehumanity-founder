import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,               // 👈 important
    strictPort: true,
    allowedHosts: 'all',
    hmr: {
      clientPort: 443         // 👈 ngrok runs on https
    }
  }
})
