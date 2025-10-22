<template>
  <div class="org-node">
    </div>
</template>

<script>
import { defineComponent, h, ref, computed, getCurrentInstance } from 'vue-demi';
// 注意：如果实际使用中 OrgNode 是自引用的，你需要确保正确的路径。
// 在本例中，因为组件名为 'OrgNode' 且导出的也是 'OrgNode'，自引用是可行的。
import OrgNode from './OrgNode.vue'; 

export default defineComponent({
  name: 'OrgNode',
  // 确保在 Vue 3 中使用 emits 声明事件
  emits: [
    'on-node-click',
    'on-expand',
    'on-node-focus',
    'on-node-mouseover',
    'on-node-mouseout',
    'on-node-drag-start',
    'on-node-drag-over',
    'on-node-drop'
  ],
  props: {
    data: { type: Object, required: true },
    props: { type: Object, default: () => ({ label: 'label', children: 'children' }) },
    horizontal: { type: Boolean, default: false },
    labelWidth: { type: Number, default: 80 },
    collapsable: { type: Boolean, default: true },
    renderContent: { type: Function, default: null },
    labelClassName: { type: String, default: '' },
    selectedClassName: { type: String, default: 'selected' },
    selectedKey: { type: [String, Number], default: null },
  },

  setup(props, { emit, attrs, slots }) {
    const instance = getCurrentInstance();
    // 使用 getCurrentInstance().proxy 来兼容 Vue 2 和 Vue 3 的 $createElement
    const proxy = instance ? instance.proxy : null;

    const expanded = ref(true);
    const childrenList = computed(() => props.data[props.props.children] || []);

    const clickHandler = () => emit('on-node-click', props.data);
    const toggleExpand = (event) => {
      event.stopPropagation();
      expanded.value = !expanded.value;
      emit('on-expand', event, props.data);
    };
    const onDragStart = (e, data) => emit('on-node-drag-start', e, data);
    const onDragOver = (e, data) => emit('on-node-drag-over', e, data);
    const onDrop = (e, data) => emit('on-node-drop', e, data);

    // 封装创建 VNode 的逻辑以兼容 Vue 2 (使用 $createElement) 和 Vue 3 (使用 h)
    const createNodeVNode = (component, nodeProps, childSlots) => {
      // Vue 2 兼容性
      if (proxy && proxy.$createElement) {
        // 在 Vue 2 中，props 需要放在 'props' 键下，事件需要在 'on' 键下
        const { on, ...restProps } = nodeProps;
        return proxy.$createElement(component, { props: restProps, on, scopedSlots: childSlots });
      }
      // Vue 3 默认逻辑
      return h(component, nodeProps, childSlots);
    };

    return () => {
      const { data, props: { label: labelKey } } = props;
      const children = childrenList.value;
      const isExpanded = expanded.value;
      const hasChildren = children.length > 0;
      
      // 节点内容 VNode
      const nodeContentVNode =
        props.renderContent && typeof props.renderContent === 'function'
          ? props.renderContent(h, data)
          : h(
              'div',
              { class: ['org-node-label', props.labelClassName], style: { width: props.labelWidth + 'px' } },
              data[labelKey]
            );

      // 展开/折叠按钮 VNode
      let expandButtonVNode = null;
      if (hasChildren && props.collapsable) {
        const btnProps = { 
          class: ['org-expand-btn', isExpanded ? 'expanded' : 'collapsed'] 
        };
        // 兼容 Vue 2/3 的事件绑定
        if (proxy && proxy.$createElement) btnProps.on = { click: toggleExpand };
        else btnProps.onClick = toggleExpand;

        expandButtonVNode = h('span', btnProps, isExpanded ? '-' : '+');
      }

      // 节点容器 VNode
      const nodeContainer = h('div', { class: 'org-node-container', onClick: clickHandler, ...attrs }, [nodeContentVNode, expandButtonVNode].filter(Boolean));

      let childrenWrapper = null;
      if (hasChildren && isExpanded) {
        // 递归创建子节点 VNode
        const childrenVNodes = children.map(child =>
          createNodeVNode(
            OrgNode, // 自引用组件
            {
              data: child,
              props: props.props,
              horizontal: props.horizontal,
              labelWidth: props.labelWidth,
              collapsable: props.collapsable,
              renderContent: props.renderContent,
              labelClassName: props.labelClassName,
              selectedClassName: props.selectedClassName,
              selectedKey: props.selectedKey,
              // 将事件转发给子组件
              on: {
                'on-node-click': (d) => emit('on-node-click', d),
                'on-expand': (e, d) => emit('on-expand', e, d),
                'on-node-focus': (e, d) => emit('on-node-focus', e, d),
                'on-node-mouseover': (e, d) => emit('on-node-mouseover', e, d),
                'on-node-mouseout': (e, d) => emit('on-node-mouseout', e, d),
                'on-node-drag-start': (e, d) => onDragStart(e, d),
                'on-node-drag-over': (e, d) => onDragOver(e, d),
                'on-node-drop': (e, d) => onDrop(e, d),
              },
            },
            slots
          )
        );

        // 根据 horizontal prop 动态添加类 'horizontal' 或 'vertical'
        childrenWrapper = h('div', { 
            class: ['org-node-children', props.horizontal ? 'horizontal' : 'vertical'] 
        }, childrenVNodes);
      }

      // 最外层节点 VNode
      return h('div', { class: ['org-node', props.horizontal ? 'horizontal' : 'vertical'] }, [nodeContainer, childrenWrapper].filter(Boolean));
    };
  }
});
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