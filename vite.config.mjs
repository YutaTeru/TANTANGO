import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

const rootDir = process.cwd()
const outDir = 'dist-unified'

export default defineConfig({
  configFile: false,
  root: rootDir,
  base: './',
  publicDir: false,
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-pwa-files',
      writeBundle() {
        try {
              fs.copyFileSync('manifest.json', `${outDir}/manifest.json`)
              fs.copyFileSync('sw.js', `${outDir}/sw.js`)
          console.log('PWA files copied successfully.')
        } catch (e) {
          console.error('Error copying PWA files:', e)
        }
      },
    },
  ],
  build: {
    outDir,
    emptyOutDir: false,
  },
})
