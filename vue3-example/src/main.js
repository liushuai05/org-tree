import { createApp } from 'vue'
import App from './App.vue'

// import OrgTree from '@plugin-src/components/OrgTree.vue'
// import OrgTree from '@liushuai05/org-tree/dist/vue3/org-tree.es.js'
// import  '@liushuai05/org-tree/dist/vue3/org-tree.css'
app=createApp(App)
console.log('vue version:', app.version)
// 全局注册组件
// app.component('OrgTree', OrgTree)

app.mount('#app')
