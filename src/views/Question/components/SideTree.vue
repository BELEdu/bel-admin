<template>
  <div class="v-side-tree">
    <!-- 唯一多选模式 -->
    <div v-if="type === 'multiple'">
      <Button
        type="primary" long
        @click="batchSelect"
      >批量选择</Button>
    </div>

    <!-- 多选单选混合模式 -->
    <div v-else>
      <!-- 知识点多选 -->
      <div
        class="multiple"
        v-if="multiple"
      >
        <Button
          type="primary"
          @click="toggleSelectType()"
        >切换为单选</Button>
        <Button
          type="primary"
          @click="batchSelect"
        >批量选择</Button>
      </div>

      <!-- 知识点单选 -->
      <Button
        v-else
        type="primary" long
        @click="toggleSelectType()"
      >切换为多选</Button>
    </div>

    <!-- 树形结构 -->
    <Tree
      ref="tree"
      :show-checkbox="multiple"
      :data="treeData"
    ></Tree>
  </div>
</template>

<script>
export default {
  name: 'v-side-tree',

  props: {
    type: {
      type: String,
      default: () => 'multiple',
    },
    treeData: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    multiple: true,
  }),

  methods: {
    toggleSelectType() {
      this.multiple = !this.multiple
    },

    batchSelect() {
      const nodes = this.$refs.tree
        .getCheckedNodes()
        .filter(node => !node.children)
      const ids = nodes
        .map(node => node.id)
      this.$emit('batch-select', ids, nodes)
    },
  },
}
</script>

<style lang="less">
.v-side-tree {

  & .multiple {

    button {
      width: 115px;

      &:first-child {
        margin-right: 20px;
      }
    }
  }
}
</style>
