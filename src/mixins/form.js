/**
 * 表单错误处理公共逻辑
 * @author luminghuai || zhoumenglin
 * @description 要最大化利用此mixin，应遵守以下约定
 * 1.视图上必须调用app-form-alert组件，并把formErrors传递给该组件，具体见示例代码
 * 2. 表单组件必须设置ref="form"
 * 3. 提交事件必须叫做submit()
 * 4. 提交按钮的loading状态命名为formLoading(组件里只需调用此属性，不需定义)
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
      formLoading: false,
    }
  },

  methods: {
    beforeSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          this.submit()
        } else {
          this.$emit('scrollToTop')
        }
      })
    },

    errorHandler({ errors, message }) {
      if (errors) {
        this.formErrors = errors
      } else if (message) {
        this.formErrors = { error: [message] }
      } else {
        this.formErrors = { error: ['服务端错误，请联系网站管理员或稍后重试'] }
      }
      this.$emit('scrollToTop')
      this.formLoading = false
    },

    successHandler() {
      this.formLoading = false
      // 判断是编辑还是添加，路由最后一级时数字的为编辑
      const id = +this.$route.path.split('/').slice(-1)[0]
      const isEdit = id > 0
      this.goBack(isEdit)
    },
  },
}
