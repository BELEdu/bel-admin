/**
 * 左侧菜单
 * @author  chenliangshan
 * @version 2017/11/20
 */

import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      permissions: state => state.permissions,
    }),
  },

  methods: {
    defaultRouterPath(permissions = this.permissions) {
      // 处理第一个菜单的子菜单路由为默认进入页
      const firstChildMenu = permissions.length && permissions[0].children
      let path = '/index'
      if (firstChildMenu.length) {
        const pathRouter = firstChildMenu[0].name.split('.')
        if (pathRouter[2]) {
          path = `/${pathRouter[1]}/${pathRouter[2]}`
        } else {
          path = `/${pathRouter[1]}`
        }
      }
      this.$router.push(path)
    },
  },
}
