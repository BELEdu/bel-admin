/**
 * 取消/回退按钮公共逻辑
 * @author hjz lmh
 * @description 如果回退的层级非一层，请在原组件定义一个goStep属性表示要回退的层数
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
      if (!!this.from || this.from.matched.length <= 0) {
        const route = this.$router.currentRoute.fullPath
          .split('/')
          .slice(0, this.goStep || -1)
          .join('/')
        this.$router.push(route)
      } else {
        this.$router.go(this.goStep || -1)
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
