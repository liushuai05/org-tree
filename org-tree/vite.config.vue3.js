import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: path.resolve(__dirname, 'dist/vue3'), // 整体输出到 vue3 目录
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'OrgTree',
      fileName: (format) => `org-tree.${format}.js`, // 简化文件名
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue', 'vue-demi'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-demi': 'VueDemi'
        },
        // 配置 CSS 输出路径（相对 outDir）
        css: {
          fileName: 'css/org-tree.css' // 输出到 dist/vue3/css
        }
      }
    }
  }
})
