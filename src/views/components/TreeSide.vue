<template>
  <div class="v-side-tree">

    <!-- 默认为唯一单选模式，不提供模式切换 -->

    <!-- 唯一多选模式 -->
    <div v-if="type === 'multiple'">
      <Button
        type="primary" long
        @click="batchSelect"
      >批量选择</Button>
    </div>

    <!-- 多选单选混合模式 -->
    <div v-if="type === 'all'">
      <!-- 知识点多选 -->
      <div
        class="multiple clearfix"
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
    <TreeConditionStructure
      ref="tree"
      :type="
        multiple || type === 'multiple'
        ? 'multiple'
        : 'single'
      "
      :data="data"
      @on-select-change="singleSelect"
    />
  </div>
</template>

<script>
/**
 * 公共组件 - 边栏树形选择组件
 *
 * @author huojinzhao
 *
 * @param   {String}  [type]  - 'single' | 'multiple' | 'all'
 * @param   {Object}  data    - 树形结构数据
 */

import TreeConditionStructure from './TreeConditionStructure'

export default {
  name: 'vTreeSide',

  components: {
    TreeConditionStructure,
  },

  props: {
    type: {
      type: String,
      default: () => 'single',
    },
    data: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    multiple: false,
  }),

  methods: {
    toggleSelectType() {
      this.multiple = !this.multiple
    },

    singleSelect([node]) {
      if (this.multiple || node.children) return
      this.$emit('single-select', [node.id], [node])
    },

    batchSelect() {
      const nodes = this.$refs.tree
        .$_getCheckedNodes()
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
        float: left;
      }

      &:last-child {
        float: right;
      }
    }
  }
}
</style>
