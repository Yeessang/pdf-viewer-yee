<template>
  <div 
    class="pdf-tree-wrapper"
  > 
    <ul>
      <li
        v-for="node in treeData"
        :key="node[nodeKey]"
        class="pdf-tree-item"
      >
        <div 
          class="pdf-tree-item-main"
          @click.stop="$emit('nodeClick', node)"  
        >
          <i 
            v-if="node.items?.length"
            class="icon iconfont icon-expand pdf-item-icon" 
            :style="{ transform: `rotate(${expandKeys.includes(node[nodeKey]) ? '0deg' : '-90deg'})` }"
            @click.stop="expandNode(node)"
          ></i>
          <span class="pdf-item-text" :title="node.title">{{ node.title }}</span>
        </div>
        <PDFTree
          v-if="node.items?.length && expandKeys.includes(node[nodeKey])"
          :tree-data="node.items"
          :node-key="nodeKey"
          :level="level + 1"
          @node-click="(_node) => $emit('nodeClick', _node)"
        ></PDFTree>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

defineComponent({
  name: 'pdf-tree',
});
</script>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
const props = defineProps({
  treeData: {
    type: Array,
    default: () => []
  },
  nodeKey: {
    type: String,
    default: "key"
  },
  level: {
    type: Number,
    default: 0
  }
});
defineEmits(["nodeClick"]);
const expandKeys = ref([]);
function expandNode(node) {
  const key = node[props.nodeKey];
  const index = expandKeys.value.indexOf(key);
  if (index === -1) {
    expandKeys.value.push(key)
  } else {
    expandKeys.value.splice(index, 1)
  }
}
</script>

<style>

</style>