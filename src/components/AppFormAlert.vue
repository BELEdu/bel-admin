<template>
  <Form-item class="app-form-alert" :label-width="fullWidth ? 1 : null">
    <Alert class="app-form-alert__alert" type="error" show-icon v-if="flatErrors.length !== 0">
      <!--<Alert type="error" show-icon >-->
      {{ title }}
      <span slot="desc">
        <div v-for="error in flatErrors">{{ error }}</div>
      </span>
    </Alert>
  </Form-item>
</template>

<script>
/**
 * 公共表单错误组件
 * @name app-form-alert
 * @author zhoumenglin
 * @description 表单提交后，服务端返回的错误统一用此组件展示
 * @param {Object} errors - 服务端出错时返回的error字段
 */

export default {
  props: {
    title: {
      type: String,
      default: '提交出现错误',
    },
    errors: {
      type: Object,
      required: true,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    flatErrors() {
      return Object.values(this.errors).reduce((result, item) => result.concat(item), [])
    },
  },
}
</script>

<style lang="less">
.app-form-alert {

  &.ivu-form-item {
    margin-bottom: 0;
  }

  &__alert{
    margin-bottom: 30px;
  }
}
</style>

