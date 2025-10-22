# org-tree


# 组织树组件
## 介绍
组织树组件是一个基于 Vue 3 和 Vue 2 实现的组织树组件（基于 [vue-org-tree](https://github.com/hukaibaihu/vue-org-tree)进行二次重写）。它可以用于展示组织架构、部门结构等。
# 依赖
- Vue 3 and Vue 2
- Vue-Demi

# 必须
- Linux 
- yarn v4


# 测试(一次只能测试一个版本的组件)
```shell
# vue2
yarn build:vue2
yarn dev:vue2


# vue3
yarn build:vue3
yarn dev:vue3
```

# 图例
![default](./doc/default.png)
![horizontal](./doc/horizontal.png)

# 使用
```shell
# vue2 
npm install @liushuai05/org-tree@vue2
# vue3 
npm install @liushuai05/org-tree@vue3
```

引入组件
```js
// vue2 详情参考 vue2-example 目录  ，但引入参考如下
import OrgTree from '@liushuai05/org-tree';
import '@liushuai05/org-tree/dist/org-tree.css';

// vue3 详情参考 vue3-example 目录 ，但引入参考如下
import OrgTree from '@liushuai05/org-tree';
import '@liushuai05/org-tree/dist/org-tree.css';

```

# 贡献

# 开源协议
MIT License

# 鸣谢

感谢 [vue-org-tree](https://github.com/hukaibaihu/vue-org-tree) 项目的作者 [hukaibaihu](https://github.com/hukaibaihu) 提供的灵感和代码。