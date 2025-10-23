import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import path from 'path'

export default defineConfig({
  plugins: [vue2()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'OrgTree',
      fileName: (format) => `org-tree.${format}.js`, // 简化文件名
      formats: ['es', 'umd', 'cjs']
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
          // 输出到 outDir 下的 css 子目录（即 dist/vue2/css）
          // 也可直接输出到 outDir 根目录：fileName: 'org-tree.css'
          fileName: 'css/org-tree.css'
        }
      }
    }
  }
})
