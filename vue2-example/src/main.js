
// Vue 2 中引入 Vue 构造函数
import Vue from 'vue'
// 引入根组件
import App from './App.vue'
// import OrgTree from '@plugin-src/components/OrgTree.vue'
// import OrgTree from '@liushuai05/org-tree/dist/vue2/org-tree.es.js'
// import  '@liushuai05/org-tree/dist/vue2/org-tree.css'

// // 全局注册组件
// Vue.component('OrgTree', OrgTree)
// 打印vue版本
console.log('vue version:', Vue.version)

// Vue 2 的实例创建方式：通过 new Vue() 挂载
new Vue({
  // 渲染根组件（Vue 2.7 支持 h 函数，无需额外引入）
  render: h => h(App)
}).$mount('#app') // 挂载到 index.html 中的 #app 元素
