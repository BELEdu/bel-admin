<script>
export default {
  name: 'TreeConditionStructure',

  props: {
    value: {},

    data: {
      type: Array,
      required: true,
    },

    // 单选 | 多选
    type: {
      type: String,
      default: 'single',
    },
  },

  data: () => ({
    rootNode: { id: 0 },

    tree: [],

    leaves: [],

    preSelectedNode: null,
  }),

  watch: {
    value(to, from) {
      if (to === '') this.m_revertLeaf(from)
    },

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

      if (!target) return

      this.$set(target, 'selected', true)

      this.m_expandParent(target.parent)
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
