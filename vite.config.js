import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
// `vite build --mode offline` maakt één zelfstandig HTML-bestand dat met dubbelklik opent (file://).
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), mode === 'offline' && viteSingleFile()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ...(mode === 'offline' && {
    base: './',
    build: { outDir: 'dist-offline', assetsInlineLimit: 100_000_000 },
  }),
}))
