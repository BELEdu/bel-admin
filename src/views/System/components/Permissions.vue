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
 * @param {Array} data - 操作权限数组
 * @param {Array} value
 * @version 2017-07-14
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
    // 字典，存储每个一级或二级项目的所有子项目的id
    // key是该一级或二级项目的id，value是所有子项目id组合成的数组
    childrenMap() {
      const map = {}

      this.data.forEach(({ id, children }) => {
        map[id] = children.map(item => item.id)

        children.forEach((child) => {
          // 后台数据不完善，可能存在二级项目没有children的情况，需要做个判断
          map[child.id] = child.children ? child.children.map(item => item.id) : []

          map[id] = [...map[id], ...map[child.id]]
        })
      })

      return map
    },
  },

  methods: {
    /**
     * 判断某项目的所有子项目是否都未被选中
     * @param {Number} id - 被判断的项目的id
     * @param {Set<Number>} result - 当前已选中的所有项目的id
     * @returns {Boolean}
     */
    isEmpty(id, result) {
      return this.childrenMap[id]
        .every(item => !result.has(item))
    },

    // check/uncheck第一层级项目，所有后代项目应跟随此项目的状态
    change(checked, id) {
      const ids = [id, ...this.childrenMap[id]]
      const result = checked ?
        this.value.concat(ids) :
        this.value.filter(item => !ids.includes(item))
      this.updateValue(result)
    },

    // check/uncheck第二层级项目，所有后代项目应跟随此项目的状态
    // 操作后，如果此项目的父项目下的所有子项目都处于未选中状态，应同时uncheck父项目
    change2(checked, id, pId) {
      const ids = [id, ...this.childrenMap[id]]
      let result = new Set(this.value)

      if (checked) {
        result = new Set([...result, ...ids, pId])
      } else {
        ids.forEach(item => result.delete(item))
        if (this.isEmpty(pId, result)) result.delete(pId)
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
        if (this.isEmpty(pId, result)) result.delete(pId)
        if (this.isEmpty(ppId, result)) result.delete(ppId)
      }

      this.updateValue(result)
    },

    updateValue(value) {
      // value可能是Set，需要转化为数组
      this.$emit('input', [...value])
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

