/**
 * 列表页删除项目并验证密码
 * @author lmh
 * @version 2017-07-14
 */

export default {
  data() {
    return {
      form: {
        password: null,
      },
      rules: {
        password: [
          this.$rules.required('密码'),
        ],
      },
      formLoading: false,
      removeId: null,
      removeModal: false,
      formErrors: {},
    }
  },

  computed: {
    CheckoutPassword() {
      return this.form.password
    },
  },

  watch: {
    // 每次开关弹框时，应该重置弹框内表单的状态
    removeModal() {
      this.formErrors = {}
      this.$refs.form.resetFields()
    },
  },

  methods: {
    // 打开弹窗，未实际删除
    prepareRemove(id) {
      this.removeModal = true
      this.removeId = id
    },

    // 验证表单，验证调用删除接口
    beforeRemove() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          this.remove()
            .then(this.successHandler)
            .catch(this.errorhandler)
        }
      })
    },

    // 删除接口错误处理
    errorHandler({ errors, message }) {
      if (errors) {
        this.formErrors = errors
      } else if (message) {
        this.formErrors = { error: [message] }
      } else {
        this.formErrors = { error: ['服务端错误，请联系网站管理员或稍后重试'] }
      }
      this.formLoading = false
    },

    // 删除成功处理
    successHandler() {
      this.formLoading = false
      this.removeModal = false
      this.removeId = null
      this.$Message.info('操作成功')
    },
  },
}
