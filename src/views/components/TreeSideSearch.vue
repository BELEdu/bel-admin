<script>
/**
 * 边栏树形搜索组件
 *
 * @author  huojinzhao
 */

// entries = [
//   {
//     label: tag name
//     key: url query key
//     data: TreeSide data
//   },
//   .....
// ]

import TreeSide from './TreeSide'

export default {
  name: 'TreeSideSearch',

  components: {
    TreeSide,
  },

  props: {
    entries: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    labelIndex: 0,
  }),

  methods: {
    v_singleSelect(key, [id]) {
      this.$emit('on-single-select', key, id)
    },
  },
}
</script>

<template>
  <aside class="tree-side-search">
    <nav class="tree-side-search__nav clearfix">
      <span
        v-for="(item, index) in entries"
        :class="{
          active: index === labelIndex
        }"
        @click="labelIndex = index"
      >{{item.label}}</span>
    </nav>
    <div class="tree-side-search__main">
      <TreeSide
        v-for="(item, index) in entries"
        v-if="index === labelIndex"
        :key="item.label"
        class="content__tree"
        :data="item.data"
        @single-select="
          ids => v_singleSelect(item.key, ids)
        "
      />
    </div>
  </aside>
</template>

<style lang="less">
@import "~vars";

.tree-side-search {
  float: left;
  width: 280px;
  height: 600px;
  border: 1px solid @border-color-base;
  border-radius: 4px;

  & > nav {
    background-color: @bg-color;
    height: 35px;

    & > span {
      float: left;
      width: 50%;
      line-height: 35px;
      text-align: center;

      &:hover {
        cursor: pointer;
        color: @info-color;
      }

      &.active {
        background-color: #fff;
        color: inherit;
        cursor: default;
      }
    }
  }

   & .v-side-tree {

    & > div:first-of-type {
      padding: 6px;
    }

    & .ivu-tree {
      overflow: auto;
      max-height: 554px;
      padding: 0 8px 8px 8px;
    }
  }
}
</style>
