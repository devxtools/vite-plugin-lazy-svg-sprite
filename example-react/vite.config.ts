import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import svgSpritePlugin from 'vite-plugin-lazy-svg-sprite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    svgSpritePlugin({
      dir: path.resolve(__dirname, '../example/assets/svg'),
    }),
  ],
  server: {
    port: 5174,
  },
})
