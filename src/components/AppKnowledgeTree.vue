<template>
  <Row class="app-knowledge-tree">
    <Col span="12">
      <div class="ivu-input-wrapper ivu-input-type original tree-header">
        <input type="text" placeholder="输入查找知识点全称" class="ivu-input" v-model="keyword">
      </div>
      <Tree :data="leftTree" multiple @on-select-change="select"></Tree>
    </Col>

    <Col span="12">
      <h4 class="tree-header">已选知识点</h4>
      <Tree :data="rightTree"></Tree>
    </Col>
  </Row>
</template>

<script>
/**
 * 树形筛知识点选组件
 * @author lmh
 * @param {Array} data - 知识点数据
 * @param {Array} value - 选中项的id所组合成的数组，应该使用v-model直接绑定
 * @version 2017-06-29
 */

export default {
  name: 'app-knowledge-tree',

  props: {
    data: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      keyword: '',
      selectedItems: [],
    }
  },

  computed: {
    // 左面板树形数据，根据props中传入的data以及keyword的值自动计算
    leftTree() {
      if (!this.keyword) {
        return this.data
      }
      return this.filterData(items => (
        items
          .filter(item => item.title.includes(this.keyword))
      ))
    },

    // 右侧面板树形数据，根据左侧选中的项目自动计算
    rightTree() {
      return this.filterData(items => (
        items
          .filter(item => this.selectedItems.includes(item))
          .map(subItem => ({
            ...subItem,
            selected: false,
            disabled: true,
          }))
      ))
    },

    // 更新v-model绑定的值
    newValue() {
      return this.selectedItems.map(item => item.title)
    },
  },

  methods: {
    filterData(handler) {
      return this.data
        .map(item => ({
          ...item,
          children: handler(item.children),
        }))
        .filter(item => item.children.length)
    },

    select(selectedItems) {
      this.selectedItems = selectedItems

      setTimeout(() => {
        this.$emit('select', this.rightTree)
        this.$emit('input', this.newValue)
      })
    },
  },
}
</script>

<style lang="less">
@import "~vars.less";

@border: 1px dashed @border-color-base;

.app-knowledge-tree {
  border: @border;

  & > .ivu-col {
    padding: 1.5em;

    &:first-child {
      border-right: @border;
    }
  }
}
</style>
