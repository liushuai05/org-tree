import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@plugin-src': path.resolve(__dirname, '../org-tree/src')
    },
  },
  server: {
    port: 5174,
  },
})
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import path from 'path'

// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//        vue: path.resolve(__dirname, '../node_modules/vue'),
//       'vue-demi': path.resolve(__dirname, '../node_modules/vue-demi'),
//       '@plugin-src': path.resolve(__dirname, '../src')
//     }
//   },
//   server: {
//     port: 3003,
//     strictPort: true
//   }
// })
