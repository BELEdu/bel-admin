<template>
  <Alert type="error" show-icon v-if="flatErrors.length !== 0">
  <!--<Alert type="error" show-icon >-->
    错误提示文案
    <span slot="desc">
      <div v-for="error in flatErrors">{{ error }}</div>
    </span>
  </Alert>
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
    errors: {
      type: Object,
      required: true,
    },
  },

  computed: {
    flatErrors() {
      return Object.values(this.errors).reduce((result, item) => result.concat(item), [])
    },
  },
}
</script>
