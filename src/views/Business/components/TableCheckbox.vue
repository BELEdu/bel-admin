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
    value: {
      type: Array,
      required: true,
    },

    list: {
      type: Array,
      required: true,
    },

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
    value: 'getAllAreasStatus',
  },

  methods: {
    setAllAreasStatus() {
      const nextStatus = !this.allareas
      if (nextStatus) {
        const list = this.list.map(item => item.id)
        this.onUpdate(list)
      } else {
        this.onUpdate([])
      }
    },

    getAllAreasStatus() {
      let status = false
      if (this.value.length > 0) {
        // 后端list数据会更新，但是value中的数据不会被更新
        // 所以拿list到value中比对
        status = this.list
          .every(item => this.value.includes(item.id))
      }
      this.allareas = status
    },

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

  & .left {
    flex-basis: 100px;
    flex-shrink: 0;
    text-align: center;

    & dt {
      height: 33px;
      border-bottom: 1px solid @border-color-base;
    }

    & dd {
      text-align: center;

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
