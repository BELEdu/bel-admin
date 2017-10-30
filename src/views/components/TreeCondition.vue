<script>
/**
 * 边栏树形条件组件
 *
 * @author  huojinzhao
 */

// entries = [
//   {
//     {string}       label           - tag name
//     {string}       key             - url query key
//     {Array}        tree            - TreeSide data
//     {Array|String} selectedLeafId  - 选中的叶子ID
//   },
//   .....
// ]

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
    keyType: '',
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

  created() {
    this.keyType = this.currentKey
    this.currentEntry.selectedLeafId = this.currentValue
  },

  methods: {
    /* --- Initialization --- */

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
    <nav class="tree-side-search__nav clearfix">
      <span
        v-for="entry in entries"
        :class="{
          active: entry.key === keyType
        }"
        :style="{
          width: `${(1 / entries.length) * 100}%`
        }"
        @click="keyType = entry.key"
      >{{entry.label}}</span>
    </nav>
    <div class="tree-side-search__main">
      <TreeConditionStructure
        v-for="entry in entries"
        v-if="entry.key === keyType"
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
