/**
 * 表单错误处理公共逻辑
 * @author luminghuai || zhoumenglin
 * @description 视图上必须调用app-form-alert组件，并把formErrors传递给该组件，具体见示例代码
 * @version 2017-06-28
 */

// 视图示例
// <app-form-alert :errors="formErrors"></app-form-alert>

// 逻辑示例
// 在调用接口时，catch接口的错误，在catch中调用errorHandler
/**
 * this.$http.post('/some/api', data)
 *  .then(this.doWhateverYouWantWhenSuccess)
 *  .catch(this.errorHandler)
 */

export default {
  data() {
    return {
      formErrors: {},
    }
  },

  methods: {
    errorHandler({ errors }) {
      if (errors) {
        this.formErrors = errors
      } else {
        this.formErrors = { error: ['服务端错误，请稍后重试'] }
      }
      this.$emit('scrollToTop')
    },
  },
}
