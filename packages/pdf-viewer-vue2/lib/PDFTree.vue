<template>
  <div 
    class="w-full h-full overflow-auto"
  > 
    <ul>
      <li
        v-for="node in treeData"
        :key="node[nodeKey]"
        class="pl-[6px] overflow-hidden text-[--pdf-catalogue-text-color]"
      >
        <div 
          class="flex h-[20px] text-[12px] cursor-pointer hover:text-[--pdf-catalogue-text-highlight] leading-[20px] text-left mb-[6px]"
          @click.stop="toDest(node)"  
        >
          <i 
            v-if="node.items?.length"
            class="icon iconfont icon-expand text-[12px] transition-all" 
            :style="{ transform: `rotate(${expandKeys.includes(node[nodeKey]) ? '0deg' : '-90deg'})` }"
            @click.stop="expandNode(node)"
          ></i>
          <span class="ml-[3px] inline-block whitespace-nowrap overflow-hidden text-ellipsis" :title="node.title">{{ node.title }}</span>
        </div>
        <pdf-tree
          v-if="node.items?.length && expandKeys.includes(node[nodeKey])"
          :tree-data="node.items"
          :node-key="nodeKey"
          :level="level + 1"
          @node-click="(_node) => toDest(_node)"
        ></pdf-tree>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'pdf-tree',
  props: {
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
  },
  data() {
    return {
      expandKeys: []
    }
  },
  methods: {
    expandNode(node) {
      const key = node[this.nodeKey];
      const index = this.expandKeys.indexOf(key);
      if (index === -1) {
        this.expandKeys.push(key)
      } else {
        this.expandKeys.splice(index, 1)
      }
    },
    toDest(node) {
      this.$emit('node-click', node)
    }
  }
}
</script>
<style>

</style>