<template>
  <div
    class="app-tree-select"
    v-clickoutside="clickOutSide"
  >
    <div
      class="ivu-select ivu-select-multiple"
      :class="{'ivu-select-visible': dropdown, 'ivu-select-disabled': disabled}"
      @click="onDropdown"
    >
      <div class="ivu-select-selection">
        <span class="ivu-select-placeholder" :style="{display: selectedItems.length ? 'none' : 'inline'}"
        >请选择...</span>
        <div v-if="multiple">
          <div
            class="ivu-tag ivu-tag-checked"
            v-for="item in selectedItems"
            :key="item.id"
          >
            <span class="ivu-tag-text">{{ item.title }}</span>
            <i class="ivu-icon ivu-icon-ios-close-empty" @click.stop="onRemove(item)"></i>
          </div>
        </div>
        <span
          v-else
          class="ivu-select-selected-value"
        >{{ selectedItems[0] && selectedItems[0].title }}</span>
        <i class="ivu-icon ivu-icon-ios-close ivu-select-arrow" style="display: none;"></i>
        <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow"></i>
      </div>
    </div>

    <div class="ivu-select-dropdown" style="width: 100%;">
      <Input
        class="app-tree-dropdown__input original"
        style="width: calc(100% - 20px);"
        v-model="keyword"
        size="small"
        placeholder="请输入搜索内容"
      />
      <div class="app-tree-dropdown" @click.stop>
        <Tree
          ref="tree"
          :key="key"
          :data="items"
          :multiple="multiple"
          @on-select-change="onSelectChange"
        />
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
      key: Math.random(),
    }
  },

  computed: {
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
     * 当一个节点的visible判断为false时，改变其render函数使其不渲染，配合CSS样式达到完全隐藏该节点相关元素的效果
     */
    keyword(val) {
      const handler = (item) => {
        if (item.children && item.children.length) {
          item.children.forEach(handler)
          item.visible = item.children.some(child => child.visible)
        } else {
          item.visible = item.title.includes(val)
        }

        item.render = item.visible ? null : () => null
      }
      this.items.forEach(handler)

      // 强制tree组建重新渲染，以便应用上面所做的render函数更改
      this.key = Math.random()
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
    /** 组件失焦时隐藏下拉菜单 */
    clickOutSide() {
      this.dropdown = false
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
     * 如果被选中的树节点不是最后一级，去除其选中状态，改变其子级展开状态
     * 剩下的所有节点推入selectedItems中，以在视图上显示选中项
     * 最后，用选中项的id更新组件所绑定的v-model
     */
    onSelectChange(selectedItems) {
      const nextSelectedItems = selectedItems.filter((item) => {
        if (item.children) {
          item.selected = false
          item.expand = !item.expand
        }
        return !item.children
      })

      // 单选情况下，点中非最后一级，nextSelectedItems将为空数组
      // 这时候不应该给this.selectedItems重新赋值
      if (nextSelectedItems.length) {
        this.selectedItems = nextSelectedItems
      } else {
        this.selectedItems[0].selected = true
      }

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

      this.$emit('change', value)
      this.$emit('input', value)
    },

    markSelected(tree) {
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
    },

    init(tree) {
      // 每次接受到树状数据时，应根据this.value的初始值，设置对应项的selected属性为true
      this.markSelected(tree)

      this.items = [...tree]
      this.$nextTick(() => {
        this.onSelectChange(this.$refs.tree.getSelectedNodes())
      })
    },
  },

  mounted() {
    this.copyData(this.data)
  },
}
</script>

<style lang="less">
  .app-tree-select {
    .ivu-select-dropdown {
      visibility: hidden;
      opacity: 0;
      transform: scaleY(0.8);
      transition: 0.3s;
      transform-origin: center top;
      overflow: hidden;


      .app-tree-dropdown {
        padding: 30px 16px 0;
        max-height: 200px;
        overflow: auto;

        &__input {
          padding: 0 0 0 20px;
          background-color: #fff;
          position: fixed;
          z-index: 10;

          .ivu-input {
            border-color: #d7dde4;

            &:hover, &:focus {
              border-color: #33b9ff;
              box-shadow: 0 0 0 2px rgba(0, 168, 255, 0.2);
            }
          }
        }
      }


    }

    .ivu-select-visible {
      & + .ivu-select-dropdown {
        visibility: visible;
        opacity: 1;
        transform: scaleY(1);
      }
    }
  }

  /* 隐藏被过滤树节点 */
  .ivu-tree-arrow:first-of-type:last-of-type,
  .ivu-tree-arrow + ul,
  .ivu-tree-arrow + ul ~ ul {
    display: none;
  }
</style>

