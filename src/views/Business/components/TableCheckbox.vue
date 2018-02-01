<template>
  <div class="v-table-checkbox">
    <div class="left">
      <dl>
        <dt></dt>
        <dd>
          <Checkbox
            v-model="allareas"
            @click.native.prevent="setAllAreasStatus"
          >
            <span>全选</span>
          </Checkbox>
        </dd>
       </dl>
    </div>
    <Checkbox-group
      class="right"
      :value="value"
      @input="onUpdate"
    >
      <dl>
        <dt>{{label}}</dt>
        <dd
          v-for="item in list"
          :key="item.display_name"
        >
          <Checkbox :label="item.id">
            <span>{{item.display_name}}</span>
          </Checkbox>
        </dd>
      </dl>
    </Checkbox-group>
  </div>
</template>

<script>
/**
 * 表形式多选组件
 *
 * @author huojinzhao
 */

export default {
  name: 'v-table-checkbox',

  props: {
    // 双向绑定的选择列表
    value: {
      type: Array,
      required: true,
    },

    // 右部分checkbox列表，根据后端推送的列表数据
    list: {
      type: Array,
      required: true,
    },

    // 右部分表头
    label: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    // 校区全选
    allareas: false,
  }),

  watch: {
    // 每次选值变化都会触发判断是否“全选”为true
    value: 'getAllAreasStatus',
  },

  methods: {
    // “全选”选择行为
    setAllAreasStatus() {
      const nextStatus = !this.allareas

      if (nextStatus) {
        const list = this.list.map(item => item.id)
        this.onUpdate(list)
      } else {
        this.onUpdate([])
      }
    },

    // 判断"全选"是否为true
    getAllAreasStatus() {
      let status = false

      if (this.value.length > 0) {
        // 后端数据库的list数据会更新，但是value中的数据不会被更新
        // 所以拿list到value中对比
        status = this.list
          .every(item => this.value.includes(item.id))
      }

      this.allareas = status
    },

    // 该组件的双向绑定输出
    onUpdate(value) {
      this.$emit('update:value', [...value])
    },
  },
}
</script>

<style lang="less">
@import '~vars';

.v-table-checkbox {
  display: flex;
  border: 1px solid @border-color-base;

  dd,
  dl {
    margin: 0;
  }

  & .left {
    flex-basis: 100px;
    flex-shrink: 0;
    text-align: center;

    & dt {
      height: 33px;
      border-bottom: 1px solid @border-color-base;
    }

    & dd {
      width: 100%;

      & .ivu-checkbox-wrapper {
        margin: 0 !important;
      }
    }
  }

  & .right {
    border-left: 1px solid @border-color-base;
    padding-left: 20px;
    flex-grow: 1;

    & dt {
      margin-left: -20px;
      border-bottom: 1px solid @border-color-base;
      text-align: center;
    }

    & dd {
      display: inline-block;
    }
  }
}

.ie {

  .v-table-checkbox {

    & .left {
      float: left;
      width: 100px;
    }

    & .right {
      overflow: hidden;
    }

  }
}
</style>
