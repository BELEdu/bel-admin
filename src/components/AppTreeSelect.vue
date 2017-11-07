<template>
  <div class="app-tree-select" v-clickoutside="clickOutSide">
    <div class="ivu-select ivu-select-multiple" :class="{'ivu-select-visible': dropdown, 'ivu-select-disabled': disabled}" @click="onDropdown">
      <div class="ivu-select-selection">
        <span class="ivu-select-placeholder" :style="{display: selectedItems.length ? 'none' : 'inline'}">请选择...</span>
        <div v-if="multiple" class="ivu-tag" v-for="item in selectedItems">
          <span class="ivu-tag-text">{{ item.title }}</span>
          <i class="ivu-icon ivu-icon-ios-close-empty" @click.stop="onRemove(item)"></i>
        </div>
        <span v-else class="ivu-select-selected-value">{{ selectedItems[0] && selectedItems[0].title }}</span>
        <i class="ivu-icon ivu-icon-ios-close ivu-select-arrow" style="display: none;"></i>
        <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow"></i>
      </div>
    </div>
    <div class="ivu-select-dropdown" style="width: 100%;">
      <div class="app-tree-dropdown" @click.stop>
        <Input class="app-tree-dropdown__input original" v-model="keyword" size="small" placeholder="请输入搜索内容"></Input>
        <Tree ref="tree" :data="filteredItems" @on-select-change="onSelectChange" :multiple="multiple"></Tree>
        <Tree ref="tree2" :data="items" :multiple="multiple" v-if="tree2" v-show="false"></Tree>
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
    data: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      defalut: false,
    },
  },

  data() {
    return {
      dropdown: false,
      items: [],
      selectedItems: [],
      keyword: '',
      initSelected: false,
      tree2: false,
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

    formItem() {
      return this.getParentCom('FormItem')
    },

    form() {
      return this.getParentCom('iForm')
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

    data(tree) {
      this.copyData(tree)
    },

    selectedItems(val) {
      // update Form Validator
      if ((val.length || this.isSelected) && this.formItem.prop && this.getFormRequired()) {
        this.formItem.validate('', (valid) => {
          this.$emit('on-validate', valid)
        })
      }
      if (val.length && !this.isSelected) this.isSelected = true
    },

  },

  methods: {
    clickOutSide() {
      this.onClickDocument()
    },

    /**
     * 拷贝数据
     */
    copyData(tree) {
      this.init(JSON.parse(JSON.stringify(tree)))
    },

    /**
     * 获取父级指定组件对象
     */
    getParentCom(componentName) {
      let parent = this.$parent
      while (parent.$options.name !== componentName) {
        parent = parent.$parent
      }
      return parent
    },

    // 获取该组件value字段是否必填
    getFormRequired() {
      const rules = this.formItem.getRules()
      return rules.map(item => item.required).indexOf(true) > -1
    },

    onDropdown() {
      this.dropdown = this.disabled ? false : !this.dropdown
    },

    /**
     * 选中树节点时所做的处理
     * 如果被选中的树节点不是最后一级，去除其选中状态并过滤掉
     * 剩下的所有节点推入selectedItems中，以在视图上显示选中项
     * 最后，用选中项的id更新组件所绑定的v-model
     *
     * this.$refs.tree.getSelectedNodes只会取到被搜索关键字过滤后的项
     * 通过渲染另外一个总是使用items作为data的Tree组件，来正确地获得选中项
     */
    onSelectChange() {
      this.tree2 = true
      this.$nextTick(() => {
        this.selectedItems = this.$refs.tree2
          .getSelectedNodes()
          .filter((item) => {
            if (item.children) {
              item.selected = false
            }
            return !item.children
          })

        this.tree2 = false
        this.updateValue()
      })
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

      this.$emit('change', value)
      this.$emit('input', value)
    },

    onClickDocument() {
      this.dropdown = false
    },

    init(tree) {
      // 每次接受到树状数据时，应根据this.value的初始值，设置对应项的selected属性为true
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
      tree.forEach(handler)

      this.items = [...tree]
      this.$nextTick(() => {
        this.onSelectChange()
      })
    },
  },

  created() {
    // document.body.addEventListener('click', this.onClickDocument)
  },

  mounted() {
    this.copyData(this.data)
  },

  beforeDestroy() {
    // document.body.removeEventListener('click', this.onClickDocument)
  },
}
</script>

<style lang="less">
.app-tree-dropdown {
  padding: 0 16px;

  &__input {
    .ivu-input {
      border-color: #d7dde4;

      &:hover, &:focus {
        border-color: #33b9ff;
        box-shadow: 0 0 0 2px rgba(0, 168, 255, 0.2);
      }
    }
  }
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

