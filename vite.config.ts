import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  root: rootDir,
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
        // ビルド後にPWA関連ファイルをdistフォルダにコピーする
        try {
          fs.copyFileSync('manifest.json', 'dist/manifest.json');
          fs.copyFileSync('sw.js', 'dist/sw.js');
          console.log('PWA files copied successfully.');
        } catch (e) {
          console.error('Error copying PWA files:', e);
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
  },
})
