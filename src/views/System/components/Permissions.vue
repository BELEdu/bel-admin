<template>
  <Form-item label="操作权限">
    <Checkbox-group class="permission-table" :value="value" @input="updateValue">
      <dl v-for="permission in data" :key="permission.id">
        <dt>
          <Checkbox :label="permission.id">
            <span>{{ permission.display_name }}</span>
          </Checkbox>
        </dt>
        <div class="permission-table__items">
          <dd v-for="item in permission.children" :key="item.id">
            <dl>
              <dt>
                <Checkbox :label="item.id">
                  <span>{{ item.display_name }}</span>
                </Checkbox>
              </dt>
              <div class="permission-table__sub-items">
                <dd v-for="subItem in item.children" :key="subItem.id">
                  <Checkbox :label="subItem.id">
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

  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },
  },
}
</script>

<style lang="less">
@import '~vars';

.permission-table {
  @padding: 5px 15px;
  @border: 1px solid @border-color-base;

  border: 1px solid @border-color-base;

  .ivu-checkbox-group-item {
    margin: 0;
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

