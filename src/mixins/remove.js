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
    removeModal() {
      this.formErrors = {}
      this.$refs.form.resetFields()
    },
  },

  methods: {
    prepareRemove(id) {
      this.removeModal = true
      this.removeId = id
    },

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

    successHandler() {
      this.formLoading = false
      this.removeModal = false
      this.removeId = null
      this.$Message.info('操作成功')
    },
  },
}
