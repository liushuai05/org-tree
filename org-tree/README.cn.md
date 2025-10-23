# org-tree


# 组织树组件
## 介绍
组织树组件是一个基于 Vue 3 和 Vue 2 实现的组织树组件（基于 [vue-org-tree](https://github.com/hukaibaihu/vue-org-tree)进行二次重写）。它可以用于展示组织架构、部门结构等。
# 依赖
- Vue 3 and Vue 2
- Vue-Demi


# 图例
![default](./doc/default.png)
![horizontal](./doc/horizontal.png)

# 使用
```shell
# vue2 
yarn add @liushuai05/org-tree@vue2 # 或者 yarn add @liushuai05/org-tree@latest
# vue3 
yarn add @liushuai05/org-tree@vue3
```

引入组件
```js
// vue2 详情参考 vue2-example 目录  ，但引入参考如下  
// 不知道什么原因，现在只能在main.js下进行引入，否则会报错
import OrgTree from '@liushuai05/org-tree';
import '@liushuai05/org-tree/dist/org-tree.css';

// vue3 详情参考 vue3-example 目录 ，但引入参考如下
// 不知道什么原因，现在只能在main.js下进行引入，否则会报错
import OrgTree from '@liushuai05/org-tree';
import '@liushuai05/org-tree/dist/org-tree.css';

```




# 开发贡献要求
## 必须
- Linux  （由于部分功能采用了shell脚本，windows没有做适配，欢迎有能力的开发者贡献windows兼容）
- yarn v4
```shell 
# 安装 yarn v4 (我是nvm管理的node版本不加sudo安装出来的不在nvm管理的路径下，没有nvm管理好像不用sudo我没有试过)
sudo corepack enable
corepack prepare yarn@stable --activate
yarn -v
v4.0.2

yarn set version stable
```
## 测试(一次只能测试一个版本的组件，不能同时测试vue2和vue3，否则可能会报错)
```shell
# vue2
yarn dev:vue2

# vue3
yarn dev:vue3
```

## 贡献
该项目和 [vue-org-tree](https://github.com/hukaibaihu/vue-org-tree) 项目的作者 [hukaibaihu](https://github.com/hukaibaihu) 对比只实现了 Vue 3 版本，Vue 2 版本兼容和横版架构图，其他功能目前没时间处理。
欢迎参与贡献，提交 Pull Request 或打开 Issue 来改进这个项目。



# 开源协议
MIT License

# 鸣谢

感谢 [vue-org-tree](https://github.com/hukaibaihu/vue-org-tree) 项目的作者 [hukaibaihu](https://github.com/hukaibaihu) 提供的灵感和代码。