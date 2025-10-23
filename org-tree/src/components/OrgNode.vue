<template>
  <div :class="['org-node', horizontal ? 'horizontal' : 'vertical']">
    <!-- 节点容器 -->
    <div class="org-node-container" @click.stop="clickHandler">
      <div
        class="org-node-label"
        :class="labelClassName"
        :style="labelWidth > 0 ? { width: labelWidth + 'px' } : {}"
      >
        <!-- 如果传入 renderContent 函数，则执行它 -->
        <component
          v-if="renderContent"
          :is="{ render: (h) => renderTo(h,data) }"
        ></component>
<!-- renderContent(h, data) -->
        <!-- 否则使用 slot -->
        <template v-else>
          <slot name="renderContent" :data="data">
            {{ data[props.label] }}
          </slot>
        </template>
      </div>

      <!-- 展开/折叠按钮 -->
      <span
        v-if="hasChildren && collapsable"
        class="org-expand-btn"
        :class="{ expanded: expanded, collapsed: !expanded }"
        @click.stop="toggleExpand"
      >
        {{ expanded ? '-' : '+' }}
      </span>
    </div>

    <!-- 子节点容器 -->
    <div
      v-if="hasChildren && expanded && level < maxLevel"
      :class="['org-node-children', horizontal ? 'horizontal' : 'vertical']"
    >
      <OrgNode
        v-for="(child, index) in childrenList"
        :key="child[props.key || 'id'] || index"
        :data="child"
        :props="props"
        :horizontal="horizontal"
        :label-width="labelWidth"
        :collapsable="collapsable"
        :label-class-name="labelClassName"
        :selected-class-name="selectedClassName"
        :selected-key="selectedKey"
        :level="level + 1"
        :max-level="maxLevel"
        :render-content="renderContent"
        @on-node-click="$emit('on-node-click', $event)"
        @on-expand="$emit('on-expand', $event, child)"
        @on-node-focus="$emit('on-node-focus', $event)"
        @on-node-mouseover="$emit('on-node-mouseover', $event)"
        @on-node-mouseout="$emit('on-node-mouseout', $event)"
        @on-node-drag-start="$emit('on-node-drag-start', $event)"
        @on-node-drag-over="$emit('on-node-drag-over', $event)"
        @on-node-drop="$emit('on-node-drop', $event)"
      >
        <template #renderContent="{ data }">
          <slot name="renderContent" :data="data"></slot>
        </template>
      </OrgNode>
    </div>
  </div>
</template>

<script>
import { h } from 'vue' 

export default {
  name: "OrgNode",
  props: {
    data: { type: Object, required: true },
    props: {
      type: Object,
      default: () => ({ label: "label", children: "children", key: "id" }),
    },
    horizontal: { type: Boolean, default: false },
    labelWidth: { type: Number, default: 0 },
    collapsable: { type: Boolean, default: true },
    labelClassName: { type: String, default: "" },
    selectedClassName: { type: String, default: "selected" },
    selectedKey: { type: [String, Number], default: null },

    // 新增递归层数控制
    level: { type: Number, default: 0 },
    maxLevel: { type: Number, default: 10000 },

    // renderContent 函数，用 createElement 生成 VNode
    renderContent: { type: Function, default: null },
  },
  data() {
    return {
      expanded: true,
    };
  },
  computed: {
    childrenList() {
      return this.data[this.props.children] || [];
    },
    hasChildren() {
      return this.childrenList.length > 0;
    },
  },
  methods: {
    isVue2() {
      // Vue 2 中 Vue 是构造函数（可以 new），且不存在 createApp 方法
      return typeof Vue === 'function' && typeof Vue.createApp !== 'function';
    },
    renderTo(vue2h, data) {
      if(this.isVue2()){
        return   this.renderContent(vue2h, data)
      }else{
        return   this.renderContent(h, data)
      }
    },
    clickHandler() {
      this.$emit("on-node-click", this.data);
    },
    toggleExpand() {
      this.expanded = !this.expanded;
      this.$emit("on-expand", this.expanded, this.data);
    },
  },
};
</script>



<style scoped>
/* -------------------- 通用样式 -------------------- */
.org-node {
  display: flex;
  position: relative; /* 确保子节点的定位相对准确 */
}

/* 节点容器 */
.org-node-container {
  padding: 10px;
  cursor: pointer;
  white-space: nowrap;
  position: relative; /* 为展开按钮定位 */

  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);

}

.org-expand-btn {
    position: absolute;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #ccc;
    color: #333;
    cursor: pointer;
    z-index: 15;
    font-size: 14px;
    font-weight: bold;
}

/* -------------------- 垂直树 (vertical) 样式 -------------------- */

.org-node {
    /* 垂直树的根节点是纵向的 */
    flex-direction: column;
    align-items: center;
    padding-top: 20px; /* 根节点不应该有 top padding，但子节点需要 */
}

/* 垂直树中，节点容器内的展开按钮位置 (底部居中) */
.org-node:not(.horizontal) > .org-node-container > .org-expand-btn {
    bottom: -10px;
    left: calc( 50% - 10px);
}
.org-node:not(.horizontal) > .org-node-container{
  margin-right: 5px;
}
/* 子节点容器 (垂直树) */
.org-node-children.vertical {
  display: flex;
  flex-direction: row; /* 子节点横向排列在一行 */
  justify-content: center;
  padding-top: 20px;
  position: relative;
}

/* 父节点到子节点集合的垂直线 */
.org-node-children.vertical::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 20px;
  border-left: 1px solid #ccc;
  transform: translateX(-50%);
}
.org-node-children.vertical > .org-node {
  position: relative;
  /* 子节点本身也是垂直的，因此它们的排列也是垂直的 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 横向连接线 (子节点之间的连接) */

/* 所有子节点到横线的垂直线 */
.org-node-children.vertical > .org-node::before {
  content: '';
  position: absolute;
  top: 0;
  height: 20px;
  border-left: 1px solid #ccc; /* 默认垂直线 */
}
.org-node-children.vertical > .org-node::after {
  content: '';
  position: absolute;
  top: 0;
  height: 20px;
  border-left: 1px solid #ccc; /* 默认垂直线 */
}

/* 调整第一个子节点的连接线 (左半横线 + 垂直线) */
.org-node-children.vertical > .org-node:first-child::before {
  left: 50%;
  width: calc(50% + 1px); 
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  transform: none;
}

/* 调整最后一个子节点的连接线 (右半横线 + 垂直线) */
.org-node-children.vertical > .org-node:last-child::before {
  left: 0;
  width: calc(50% + 1px); 
  border-top: 1px solid #ccc;
  border-left: none;
  transform: none;
}

/* 覆盖中间节点的连接线 (只有完整的横线) */
.org-node-children.vertical > .org-node:not(:first-child):not(:last-child)::before {
  left: 0;
  width: 100%; 
  border-top: 1px solid #ccc;
  border-left: none; 
  transform: none;
}

/* 只有一个子节点时的特殊处理 (只有垂直线) */
.org-node-children.vertical > .org-node:only-child::before {
  width: 0;
  left: 50%;
  border-top: none;
  border-left: 1px solid #ccc;
  transform: translateX(-50%);
}


/* -------------------- 横向树 (horizontal) 样式 -------------------- */

.org-node-children.horizontal {
  display: flex;
  flex-direction: column; /* 横向树时子节点纵向排列 */
  align-items: flex-start;
  padding-left: 20px; /* 为连接线留出空间 */
  position: relative;
}

/* 调整最外层 org-node 的排列，使其横向 */
.org-node.horizontal {
    /* 需要组件根节点支持属性绑定才能生效，或者直接使用 .horizontal 类 */
    flex-direction: row;
    align-items: center;
    padding-top: 0;
    
}
/* 横向树的节点本身也是横向的 */
.org-node.horizontal  {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 5px; 
    padding-left: 20px;
}

/* 横向树中，节点容器内的展开按钮位置 (右侧居中) */
.org-node.horizontal   .org-expand-btn {
    top: calc( 50% - 10px);
    right: -10px;
}

/* 父节点到子节点集合的水平线 */
.org-node-children.horizontal::before {
  content: '';
  position: absolute;
  top: 50%; 
  left: 0;
  height: 0;
  width: 20px; 
  border-top: 1px solid #ccc;
  transform: translateY(-50%);
}

/* 垂直连接线 (子节点之间的连接) */

/* 所有子节点到竖线的水平线 */
.org-node-children.horizontal > .org-node::before {
  content: '';
  position: absolute;
  left: 0;
  width: 20px; 
  /* border-top: 1px solid #ccc;  */
  border-left: 1px solid #ccc; 
}
.org-node-children.horizontal > .org-node::after {
  content: '';
  position: absolute;
  left: 0;
  width: 20px; 
}

/* 调整第一个子节点的连接线 (上半竖线 + 水平线) */
.org-node-children.horizontal > .org-node:first-child::before {
  top: 50%; 
  height: calc(50% + 1px); 
  border-left: 1px solid #ccc; 
  border-top: 1px solid #ccc; 
  /* transform: translateY(-50%); */
}

/* 调整最后一个子节点的连接线 (下半竖线 + 水平线) */
.org-node-children.horizontal > .org-node:last-child::before {
  top: 0;
  height: calc(50% + 1px); 
  border-bottom: 1px solid #ccc; 
  transform: none;
}

/* 覆盖中间节点的连接线 (只有完整的竖线) */
.org-node-children.horizontal > .org-node:not(:first-child):not(:last-child)::before {
  top: 0;
  height: 100%; 
  border-left: 1px solid #ccc;
  transform: none;
}

.org-node-children.horizontal > .org-node:not(:first-child):not(:last-child)::after {
  top: 0;
  height: 50%; 
  border-bottom: 1px solid #ccc;
  transform: none;
}

/* 只有一个子节点时的特殊处理 (只有水平线) */
.org-node-children.horizontal > .org-node:only-child::before {
  top: 50%;
  height: 0;
  border-left: none;
  border-top: 1px solid #ccc;
  transform: translateY(-50%);
}
</style>