import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// SEM viteSingleFile para testar

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { assetsInlineLimit: 100_000_000 },
})
