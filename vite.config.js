import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use relative base so assets work under /<repo>/ on GitHub Pages
  base: './',
  build: {
    outDir: 'docs', // Deploy from /docs on the default branch
    emptyOutDir: true,
  },
})
