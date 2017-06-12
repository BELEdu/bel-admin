<template>
  <Menu class="app-menu" theme="light" :active-name="activeName" :open-names="openNames" accordion @on-select="goTo">
    <Submenu v-for="menu in menus" :key="menu.name" :name="menu.name" :class="{'app-menu__link-item': !menu.children}">
      <template slot="title">
        <Icon :type="icons[menu.name]"></Icon>
        <template v-if="menu.children">{{ menu.display_name }}</template>
        <!--这里用了一个非常规的方式来解决Menu组件的第一级无法作为链接的问题-->
        <!--具体实现方式请看下方的CSS代码-->
        <Menu-item v-else :name="menu.name">
          {{ menu.display_name }}
        </Menu-item>
      </template>
      <template v-if="menu.children">
        <Menu-item v-for="submenu in menu.children" :key="submenu.name" :name="submenu.name">
          {{ submenu.display_name }}
        </Menu-item>
      </template>
    </Submenu>
  </Menu>
</template>

<script>
/**
 * 应用侧边导航
 * @author lmh
 * @version 2017-06-05
 */

import { mapState } from 'vuex'

export default {
  name: 'app-menu',

  data: () => ({
    activeName: 'front.index',
    openNames: [],
    icons: {
      'front.index': 'ios-home',
      'front.business': 'briefcase',
      'front.student': 'ios-people',
      'front.arrange': 'ios-grid-view',
      'front.prepare': 'ios-list',
      'front.analysis': 'stats-bars',
      'front.system': 'ios-gear',
      'front.feedback': 'chatbox',
    },
  }),

  computed: {
    ...mapState(['menus']),
  },

  methods: {
    goTo(name) {
      // name是'front.index'这样的格式，这里要把它转换为可用的路径
      const items = name.split('.')
      if (items[2]) {
        this.$router.push(`/${items[1]}/${items[2]}`)
      } else {
        this.$router.push(`/${items[1]}`)
      }
    },
  },

  created() {
    // Menu组件不使用router-link来转跳路由
    // 这里必须手动查看路由，以便通知Menu组件当前应该高亮的项目
    const partials = this.$route.path.split('/')
    this.activeName = `front${partials.join('.')}`

    // 设置当前展开的菜单
    this.openNames = [`front${partials.slice(0, 2).join('.')}`]
  },
}
</script>

<style lang="less">
@import '~vars';

.app-menu__link-item {
  .ivu-menu-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-left: 46px !important;
    border-right-width: 3px !important;

    &:hover {
      background-color: transparent;
    }
  }

  .ivu-menu-submenu-title-icon {
    display: none;
  }
}
</style>
