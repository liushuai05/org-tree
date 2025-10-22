import OrgTree from './components/OrgTree.vue'

// Vue2 / Vue3 兼容安装函数
OrgTree.install = function (app) {
  app.component(OrgTree.name, OrgTree)
}

export default OrgTree
export { OrgTree }
