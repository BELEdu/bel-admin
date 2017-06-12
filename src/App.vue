<template>
  <router-view @login="connectToSocket"></router-view>
</template>

<script>
/**
 * 应用容器
 * @author lmh
 * @version 2017-06-06
 */

import io from 'socket.io-client'
import { mapState } from 'vuex'
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'main',

  computed: {
    ...mapState(['token', 'user']),
  },

  methods: {
    // 连接socket.io
    connectToSocket() {
      const socket = io.connect(`https://oa.caihonggou.com:9500?user_id=${this.user.id}`)

      // 初始化用户权限和消息数目
      socket.on('init', (data) => {
        // eslint-disable-next-line
        console.log(data)
      })

      // 监听后台消息推送
      socket.on('update', ({ menus }) => {
        if (menus) {
          this.$store.dispatch(GLOBAL.MENUS.UIPDATE, menus)
        }
      })
    },
  },

  created() {
    // （在用户刷新页面后）若用户已登录，重新连接socket
    if (this.token) {
      this.connectToSocket()
    }
  },
}
</script>
