<script>
/**
 * 公共组件 - 边栏树形条件组件
 *
 * @author  huojinzhao
 * @desc 可点击label切换对应tree组件显示
 */

// interface Entry {
//   label: string, // tag name
//   key: string, // url query key
//   tree: IviewTreeData, // iview Tree组件数据
//   selectedLeafId: number|number[], // 选中的叶子节点
// }

// type Entries = Entry[]

import TreeConditionStructure from './TreeConditionStructure'

export default {
  name: 'TreeCondition',

  components: {
    TreeConditionStructure,
  },

  props: {
    entries: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    labelKey: '',
  }),

  computed: {
    currentEntry() {
      const keys = Object.keys(this.$route.query)

      const target = this.entries.find(
        entry => keys.some(key => key === entry.key),
      )

      return target || this.entries[0]
    },

    currentKey() {
      return this.currentEntry.key
    },

    currentValue() {
      const value = this.$route.query[this.currentKey]

      return value ? parseInt(value, 10) : ''
    },
  },

  // 初始化选中逻辑
  created() {
    // 初始化标签选中
    this.labelKey = this.currentKey
    // 初始化树节点展开
    this.currentEntry.selectedLeafId = this.currentValue
  },

  methods: {
    /* --- Initialization --- */

    vm_selectLabel(key) {
      this.labelKey = key
    },

    // 将选中entryKey=treeValue键值对推到query上，不同标签是互斥的
    v_singleSelect(key, id) {
      const { [this.currentKey]: filter, ...rest } = this.$route.query

      const query = { [key]: id, ...rest }

      this.$router.push({ query })
    },
  },
}
</script>

<template>
  <aside class="tree-side-search">
    <!-- 标签切换条 -->
    <nav class="tree-side-search__nav clearfix">
      <span
        v-for="entry in entries"
        :class="{
          active: entry.key === labelKey
        }"
        :style="{
          width: `${(1 / entries.length) * 100}%`
        }"
        @click="vm_selectLabel(entry.key)"
      >{{entry.label}}</span>
    </nav>
    <!-- 下方树形组件，点击标签切换 -->
    <div class="tree-side-search__main">
      <TreeConditionStructure
        v-for="entry in entries"
        v-if="entry.key === labelKey"
        class="content__tree"
        v-model="entry.selectedLeafId"
        :key="entry.key"
        :data="entry.tree"
        @click="id => v_singleSelect(entry.key, id)"
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

  &__nav {
    background-color: @bg-color;
    height: 35px;

    & > span {
      float: left;
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

  &__main {
    padding: 0 8px;
    max-height: 563px;
    overflow: auto;
  }
}
</style>
