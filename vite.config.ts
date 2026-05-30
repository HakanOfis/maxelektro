import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// Custom domain (maxelektro.be) → base is always "/"
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  plugins: [
    react(),
    tsconfigPaths(),
  ],
})
