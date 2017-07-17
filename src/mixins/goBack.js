/**
 * 取消/回退按钮公共逻辑
 * @author hjz lmh
 * @description 在from不存在的时候，默认会根据路由meta中定义的breadcrumb对象来获取上一级路由
 * 若此某些情况下此默认操作无法得到预期的结果，请在组件里自己定义一个backRoute属性，用来指明上一级路由
 * @version 2017-06-28
 */

export default {
  data() {
    return {
      from: null,
    }
  },

  methods: {
    goBack(isEdit) {
      try {
        const { breadcrumb } = this.$route.meta
        const { link } = breadcrumb[breadcrumb.length - 2]

        // 本页面是进入本应用后的第一个页面（用户直接输入地址等情况）
        const isFirstView = !this.from || this.from.matched.length <= 0

        if (isFirstView || !isEdit) {
          this.$router.push(this.backRoute || link)
        } else {
          this.$router.go(-1)
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log(error)
      }
    },
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // eslint-disable-next-line
      vm.from = from
    })
  },
}
