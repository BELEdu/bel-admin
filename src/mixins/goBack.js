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
    goBack() {
      if (!this.from || this.from.matched.length <= 0) {
        try {
          const { breadcrumb } = this.$route.meta
          const { link } = breadcrumb[breadcrumb.length - 2]

          this.$router.push(this.backRoute || link)
        } catch (error) {
          // eslint-disable-next-line
          console.log(error)
        }
      } else {
        this.$router.go(-1)
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
