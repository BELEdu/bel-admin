<template>
  <Form-item>
    <Alert class="app-form-alert" type="error" show-icon v-if="flatErrors.length !== 0">
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
      default: '错误提示文案',
    },
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

<style lang="less">
.app-form-alert {
  margin-bottom: 30px;
}
</style>

