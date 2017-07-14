<template>
  <Form-item label="操作权限">
    <Checkbox-group class="permission-table" :value="value">
      <dl v-for="permission in data" :key="permission.id">
        <dt>
          <Checkbox :label="permission.id" @input="checked => change(checked, permission.id)">
            <span>{{ permission.display_name }}</span>
          </Checkbox>
        </dt>
        <div class="permission-table__items">
          <dd v-for="item in permission.children" :key="item.id">
            <dl>
              <dt>
                <Checkbox :label="item.id" @input="checked => change2(checked, item.id, permission.id)">
                  <span>{{ item.display_name }}</span>
                </Checkbox>
              </dt>
              <div class="permission-table__sub-items">
                <dd v-for="subItem in item.children" :key="subItem.id">
                  <Checkbox :label="subItem.id" @input="checked => change3(checked, subItem.id, item.id, permission.id)">
                    <span>{{ subItem.display_name }}</span>
                  </Checkbox>
                </dd>
              </div>
            </dl>
          </dd>
        </div>
      </dl>
    </Checkbox-group>
  </Form-item>
</template>

<script>
/**
 * 操作权限表单组件
 * @author lmn
 * @param {Array} data - 数据权限数组
 * @param {Array} disabledIds - 角色固有权限的id，对应的勾选框将被禁用，用于修改用户权限页
 * @version 2017-06-27
 */

export default {
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

  computed: {
    ids() {
      return new Set(this.value)
    },
  },

  methods: {
    // getSelfAndDescendents方法的辅助方法，用来递归地获取后代id
    recursiveReduce(ids, { id, children }) {
      if (children) {
        return [...ids, id, ...children.reduce(this.recursiveReduce, [])]
      }
      return [...ids, id]
    },

    /**
     * 获取自身及所有后代项的id
     * @param {Number} id - 自身id
     * @param {Number} [pid] - 父级id，自身不是第一层级项目时需传此参数
     * @returns {Number[]}
     */
    getSelfAndDescendents(id, pId) {
      const data = pId ?
        this.data.find(item => item.id === pId).children :
        this.data

      return data
        .filter(item => item.id === id)
        .reduce(this.recursiveReduce, [])
    },

    /**
     * 获取所有子项目的id
     * @description 此方法由isChildrenAllUnchecked方法调用，不应直接调用
     * @param {Number} ppId - 只传此参数时，表示获取此id项下的子项目
     * @param {Number} [pId] - 当此参数被传递时，表示获取此id项下的子项目，此时上一参数用来辅助获取此参数表示的项
     * @returns {Number[]}
     */
    getChildren(ppId, pId) {
      let items = this.data.find(item => item.id === ppId).children
      if (pId) {
        items = items.find(item => item.id === pId).children
      }
      return items.map(item => item.id)
    },

    /**
     * 判断某项目的所有子项目是否都未被选中
     * @param {Number[]} result - 当前被选中的所有项目的id
     * @param {Number} ppId - 只传此参数时，表示判断此id项下的子项目
     * @param {Number} [pId] - 当此参数被传递时，表示判断此id项下的子项目，此时上一参数用来辅助获取此参数表示的项
     * @returns {Boolean}
     */
    isChildrenAllUnchecked(result, ppId, pId) {
      const siblingIds = this.getChildren(ppId, pId)
      return siblingIds.every(item => !result.has(item))
    },

    // check/uncheck第一层级项目，所有后代项目应跟随此项目的状态
    change(checked, id) {
      const ids = this.getSelfAndDescendents(id)
      const result = checked ?
        this.value.concat(ids) :
        this.value.filter(item => !ids.includes(item))
      this.updateValue(result)
    },

    // check/uncheck第二层级项目，所有后代项目应跟随此项目的状态
    // 操作后，如果此项目的父项目下的所有子项目都处于未选中状态，应同时uncheck父项目
    change2(checked, id, pId) {
      const ids = this.getSelfAndDescendents(id, pId)

      let result = new Set(this.value)
      if (checked) {
        result = new Set([...result, ...ids, pId])
      } else {
        ids.forEach(item => result.delete(item))
        if (this.isChildrenAllUnchecked(result, pId)) {
          result.delete(pId)
        }
      }

      this.updateValue(result)
    },

    // check/uncheck第二层级项目，所有后代项目应跟随此项目的状态
    // 操作后，如果此项目的父项目下的所有子项目都处于未选中状态，应同时uncheck父项目
    // 上一操作后,应用同样的方式继续检查父项目的父项目是否应被uncheck
    change3(checked, id, pId, ppId) {
      let result = new Set(this.value)
      if (checked) {
        result = new Set([...result, id, pId, ppId])
      } else {
        result.delete(id)
        if (this.isChildrenAllUnchecked(result, ppId, pId)) {
          result.delete(pId)
        }
        if (this.isChildrenAllUnchecked(result, ppId)) {
          result.delete(ppId)
        }
      }

      this.updateValue(result)
    },

    updateValue(value) {
      // value可能是Set，需要转化为数组
      this.$emit('input', Array.from(value))
    },
  },
}
</script>

<style lang="less">
@import "~vars";

.permission-table {
  @padding: 5px 15px;
  @border: 1px solid @border-color-base;

  border: 1px solid @border-color-base;

  .ivu-checkbox-group-item {
    margin: 0 !important;
    line-height: normal;
  }

  dl {
    display: flex;

    &:not(:last-child) {
      border-bottom: @border;
    }

    & > dt {
      flex: none;
      align-self: center;
      padding: @padding;
    }
  }

  &__items {
    flex: auto;
    border-left: @border;

    & > dd {
      flex: none;

      &:not(:last-child) {
        dl {
          border-bottom: @border;
        }
      }

      dt {
        width: 9em;
      }
    }
  }

  &__sub-items {
    display: flex;
    flex-wrap: wrap;
    padding: @padding;
    border-left: @border;

    & > dd {
      margin-right: 10px;
    }
  }
}

// 兼容ie
.ie {
  .permission-table {
    dl {
      overflow: hidden;

      & > dt {
        display: inline-block;
        width: 8em;
        vertical-align: middle;
        margin-right: -4px;
        text-align: center;
      }
    }

    &__items {
      display: inline-block;
      width: calc(~"100% - 8em");
      vertical-align: middle;
      margin-right: -4px;
    }

    &__sub-items {
      display: inline-block;
      width: calc(~"100% - 9em");
      vertical-align: middle;
      margin-right: -4px;

      & > dd {
        float: left;
      }
    }
  }
}
</style>

