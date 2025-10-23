<template>
  <div class="org-tree-root">
    <OrgNode 
      v-if="treeData"
      :data="treeData"
      :props="props"
      :horizontal="horizontal"
      :label-width="labelWidth"
      :collapsable="collapsable"
      :render-content="renderContent"
      :label-class-name="labelClassName"
      :selected-class-name="selectedClassName"
      :selected-key="selectedKey"
      v-bind="$attrs"
      @on-expand="(e, data) => $emit('on-expand', e, data)"
      @on-node-focus="(e, data) => $emit('on-node-focus', e, data)"
      @on-node-click="(e, data) => $emit('on-node-click', e, data)"
      @on-node-mouseover="(e, data) => $emit('on-node-mouseover', e, data)"
      @on-node-mouseout="(e, data) => $emit('on-node-mouseout', e, data)"
      @on-node-drag-start="(e, data) => onDragStart(e, data)"
      @on-node-drag-over="(e, data) => onDragOver(e, data)"
      @on-node-drop="(e, data) => onDrop(e, data)"
    >
      <!-- 支持透传 slot -->
      <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
        <slot :name="slotName" v-bind="slotData" />
      </template>
    </OrgNode>
  </div>
</template>

<script>
import { defineComponent } from 'vue-demi';
import OrgNode from './OrgNode.vue';

export default defineComponent({
  name: 'OrgTree',
  components: { OrgNode },
  

  // --- 事件列表，向上递归冒泡 ---
  emits: [
    'on-node-click',       // 节点点击事件
    'on-expand',           // 节点展开/收起事件
    'on-node-focus',       // 节点获取焦点事件
    'on-node-mouseover',   // 鼠标悬停事件
    'on-node-mouseout',    // 鼠标移出事件
    'on-node-drag-start',  // 节点拖拽开始
    'on-node-drag-over',   // 节点拖拽经过
    'on-node-drop'         // 节点拖拽释放
  ],

  props: {
    // --- 必传数据对象 ---
    data: { type: Object, required: true }, // 当前节点数据对象

    // --- 节点属性配置 (透传给子节点) ---
    props: { type: Object, default: () => ({ label: 'label', children: 'children' }) },
    // 说明：
    // label -> 节点显示文本字段名
    // children -> 节点子节点字段名

    // --- 布局和样式参数 ---
    horizontal: { type: Boolean, default: false },        // 树是否水平布局
    labelWidth: { type: Number, default: 0 },           // 节点标签宽度
    collapsable: { type: Boolean, default: true },       // 是否允许折叠子节点
    renderContent: { type: Function, default: null },     // 自定义渲染节点内容的函数
    labelClassName: { type: String, default: '' },        // 节点文本的 CSS 类名
    selectedClassName: { type: String, default: 'selected' }, // 选中节点的样式类
    selectedKey: { type: [String, Number], default: null },   // 当前选中节点 key
  },
  
  setup(props, { emit, attrs }) {
    const treeData = props.data;

    const onDragStart = (e, data) => {
      emit('on-node-drag-start', e, data);
    };
    const onDragOver = (e, data) => {
      emit('on-node-drag-over', e, data);
    };
    const onDrop = (e, data) => {
      emit('on-node-drop', e, data);
    };

    return {
      treeData,
      onDragStart,
      onDragOver,
      onDrop
    };
  }
});
</script>

<style scoped>
.org-tree-root {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  overflow: auto;
}
</style>
