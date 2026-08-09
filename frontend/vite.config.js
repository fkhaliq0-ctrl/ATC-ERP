import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,  // Fail if port 5173 is in use instead of using another port
    allowedHosts: [
      'sudoku-fragrance-overhung.ngrok-free.dev',
      '.ngrok-free.dev'
    ]
  }
})
