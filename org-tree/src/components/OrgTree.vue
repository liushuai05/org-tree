<template>
  <div class="org-tree-root">
    <OrgNode 
      v-if="treeData"
      :data="treeData"
      :props="props"
      :horizontal="horizontal"
      :labelWidth="labelWidth"
      :collapsable="collapsable"
      :renderContent="renderContent"
      :labelClassName="labelClassName"
      :selectedClassName="selectedClassName"
      :selectedKey="selectedKey"
      v-bind="$attrs"
      @on-node-drag-start="onDragStart"
      @on-node-drag-over="onDragOver"
      @on-node-drop="onDrop"
    >
      <!-- 插槽透传 (Vue 2 + 3 兼容写法) -->
      <template v-for="slotName in Object.keys($slots)" v-slot:[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </OrgNode>
  </div>
</template>

<script>
import OrgNode from './OrgNode.vue';

export default {
  name: 'OrgTree',
  components: { OrgNode },

  props: {
    data: { type: Object, required: true },
    props: { type: Object, default: () => ({ label: 'label', children: 'children' }) },
    horizontal: { type: Boolean, default: false },
    labelWidth: { type: Number, default: 0 },
    collapsable: { type: Boolean, default: true },
    renderContent: { type: Function, default: null },
    labelClassName: { type: String, default: '' },
    selectedClassName: { type: String, default: 'selected' },
    selectedKey: { type: [String, Number], default: null },
  },

  computed: {
    treeData() {
      return this.data;
    }
  },

  methods: {
    onDragStart(e, data) {
      this.$emit('on-node-drag-start', e, data);
    },
    onDragOver(e, data) {
      this.$emit('on-node-drag-over', e, data);
    },
    onDrop(e, data) {
      this.$emit('on-node-drop', e, data);
    }
  }
};
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
