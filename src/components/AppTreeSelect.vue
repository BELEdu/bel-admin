<template>
  <div class="app-tree-select" @click.stop>
    <div class="ivu-select ivu-select-multiple" :class="{'ivu-select-visible': dropdown}" @click="onDropdown">
      <div class="ivu-select-selection">
        <div class="ivu-tag" v-for="item in selectedItems">
          <span class="ivu-tag-text">{{ item.title }}</span>
          <i class="ivu-icon ivu-icon-ios-close-empty" @click.stop="onRemove(item)"></i>
        </div>
        <span class="ivu-select-placeholder" :style="{display: selectedItems.length ? 'none' : 'inline'}">请选择...</span>
        <i class="ivu-icon ivu-icon-ios-close ivu-select-arrow" style="display: none;"></i>
        <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow"></i>
      </div>
    </div>
    <div class="ivu-select-dropdown" style="width: 100%;">
      <div class="app-tree-dropdown">
        <Input class="original" v-model="keyword" size="small" placeholder="请输入搜索内容"></Input>
        <Tree ref="tree" :data="filteredItems" @on-select-change="onSelectChange" :multiple="multiple"></Tree>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */

export default {
  name: 'app-tree-select',

  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    value: {
      required: true,
    },
  },

  data() {
    return {
      dropdown: false,
      items: [],
      selectedItems: [],
      keyword: '',
    }
  },

  computed: {
    /**
     * 经搜索过滤后的树
     * 如果未输入搜索关键字，返回整棵树，否则根据节点的visible属性过滤出需要显示的节点
     */
    filteredItems() {
      if (this.keyword === '') {
        return this.items
      }
      const handler = (item) => {
        if (item.visible && item.children) {
          item.children = item.children.filter(handler)
        }
        return item.visible
      }
      return this.items.filter(handler)
    },
  },

  watch: {
    /**
     * 根据搜索关键字，判断出每个树节点的可见性
     * 若当前节点为树结构的最后一级，根据其是否含有搜索关键字，设置其visible属性
     * 其它每一个层级的节点，递归地检查其下一级中是否有任何节点visible属性为true，若有，则其本身的visible属性也设为true
     */
    keyword(val) {
      const handler = (item) => {
        if (item.children && item.children.length) {
          item.children.forEach(handler)
          item.visible = item.children.some(child => child.visible)
        } else {
          item.visible = item.title.includes(val)
        }
      }
      this.items.forEach(handler)
    },
  },

  methods: {
    onDropdown() {
      this.dropdown = !this.dropdown
    },

    /**
     * 选中树节点时所做的处理
     * 如果被选中的树节点不是最后一级，去除其选中状态并过滤掉
     * 剩下的所有节点推入selectedItems中，以在视图上显示选中项
     * 最后，用选中项的id更新组件所绑定的v-model
     */
    onSelectChange() {
      this.selectedItems = this.$refs.tree
        .getSelectedNodes()
        .filter((item) => {
          if (item.children) {
            item.selected = false
          }
          return !item.children
        })
      this.updateValue()
    },

    /**
     * 删除输入框中已选中的项时所做的处理
     * 把该项的selected的标记为false
     * 更新selectedItems和v-model
     */
    onRemove(removedItem) {
      // eslint-disable-next-line
      removedItem.selected = false
      this.selectedItems = this.$refs.tree
        .getSelectedNodes()
      this.updateValue()
    },

    updateValue() {
      let value
      if (this.multiple) {
        value = this.selectedItems.map(item => item.id)
      } else if (this.selectedItems[0]) {
        value = this.selectedItems[0].id
      }
      this.$emit('input', value)
    },

    onClickDocument() {
      this.dropdown = false
    },
  },

  created() {
    this.$http.get('/knowledge/tree/5')
      .then((result) => {
        // 组件创建时，应根据this.value的初始值，设置对应项的selected属性为true
        const handler = (item) => {
          if (item.children) {
            item.children.forEach(handler)
          }

          const mutilpleSelected = this.multiple && this.value.includes(item.id)
          const singleSelected = !this.multiple && this.value === item.id
          if (mutilpleSelected || singleSelected) {
            item.selected = true
          }
        }
        result.forEach(handler)

        this.items = result
      })

      .then(() => {
        this.onSelectChange()
      })

    document.body.addEventListener('click', this.onClickDocument)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.onClickDocument)
  },
}
</script>

<style lang="less">
.app-tree-dropdown {
  padding: 0 16px;
}

.app-tree-select {
  .ivu-select-dropdown {
    visibility: hidden;
    opacity: 0;
    transform: scaleY(0.8);
    transition: 0.3s;
    transform-origin: center top;
  }

  .ivu-select-visible {
    & + .ivu-select-dropdown {
      visibility: visible;
      opacity: 1;
      transform: scaleY(1);
    }
  }
}
</style>

