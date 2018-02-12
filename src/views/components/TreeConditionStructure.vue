<script>
/**
 * 公共组件 - iview树组件拓展
 *
 * @author  huojinzhao
 * @desc 可点击label切换对应tree组件显示
 */

export default {
  name: 'TreeConditionStructure',

  props: {
    value: {},

    // 树结构入口数据
    data: {
      type: Array,
      required: true,
    },

    // 单选 | 多选，目前只支持单选
    type: {
      type: String,
      default: 'single',
    },
  },

  data: () => ({
    // 虚拟根树节点
    rootNode: { id: 0 },

    // 由入口数据生成的双向树数据
    tree: [],

    // 叶子节点
    leaves: [],

    preSelectedNode: null,
  }),

  watch: {
    value(to, from) {
      if (to === '') this.m_revertLeaf(from)
    },

    // 入口数据变化，重新生成双向树数据
    data(to, from) {
      if (to !== from) this.tree = this.tree2way(to)
    },
  },

  created() {
    this.tree = this.tree2way(this.data)

    if (this.value) this.m_selectLeaf(this.value)
  },

  methods: {
    /* --- Initialization --- */

    // 做了两件事情：1、生成叶子节点数组；2、生成双向树数据结构
    tree2way(children, parent = this.rootNode) {
      return children.map((item) => {
        const child = { ...item }
        let cNodes = child.children

        if (cNodes && cNodes.length) {
          cNodes = this.tree2way(cNodes, child)
        } else {
          this.m_initLeaves(child)
        }

        this.$set(child, 'parent', parent)
        this.$set(child, 'children', cNodes)

        return child
      })
    },

    m_initLeaves(leaf) {
      this.leaves.push(leaf)
    },

    /* --- business --- */

    v_selectLeaf([node]) {
      if (node && node.children) {
        this.m_toggleUnleafExpand(node)
      } else {
        const value = node ? node.id : ''

        this.$emit('input', value)
        this.$emit('click', value)
      }
    },

    findLeaf(leafId) {
      return this.leaves.find(leaf => leaf.id === leafId)
    },

    m_toggleUnleafExpand(node) {
      this.$set(node, 'expand', !node.expand)
      this.$set(node, 'selected', false)

      return true
    },

    m_selectLeaf(leafId) {
      const target = this.findLeaf(leafId)

      // 非叶子节点不做操作
      if (!target) return
      // 初始化选中叶子时展开祖先节点
      this.m_expandParent(target.parent)

      this.$set(target, 'selected', true)
    },

    m_revertLeaf(leafId) {
      const target = this.findLeaf(leafId)

      if (target) this.$set(target, 'selected', false)
    },

    m_expandParent(node) {
      if (!node.expand) this.$set(node, 'expand', true)

      if (node.parent) this.m_expandParent(node.parent)
    },

    $_getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes()
    },
  },
}
</script>

<template>
  <Tree
    ref="tree"
    :data="tree"
    :multiple="type === 'multiple'"
    :show-checkbox="type === 'multiple'"
    @on-select-change="v_selectLeaf"
  ></Tree>
</template>

<style lang="less">

</style>
