import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import path from 'path'

export default defineConfig({
  plugins: [vue2()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@plugin-src': path.resolve(__dirname, '../org-tree/src')
    },
  },
  server: {
    port: 5173,
  },
})
