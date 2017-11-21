<template>
  <Menu class="app-menu" theme="light" :active-name="activeName" :open-names="openNames" accordion @on-select="goTo" width="200px">
    <Submenu v-for="menu in permissions" :key="menu.name" :name="menu.name" :class="{'app-menu__link-item': !menu.children}">
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
 * @version 2017-06-30 使用permissions取代menus来循环出菜单
 */

import { mapState } from 'vuex'
import { emitter } from '@/mixins'

export default {
  name: 'app-menu',

  mixins: [emitter],

  data: () => ({
    icons: {
      'front.index': 'ios-home',
      'front.business': 'briefcase',
      'front.student': 'ios-people',
      'front.curriculum': 'ios-calendar',
      'front.examination': 'ios-book',
      'front.prepare': 'ios-list',
      'front.analysis': 'stats-bars',
      'front.system': 'ios-gear',
      'front.question': 'social-buffer',
      'front.algorithm': 'ios-pie',
      'front.setting': 'ios-toggle',
    },
  }),

  computed: {
    ...mapState(['permissions']),

    menuCom() {
      return this.findComponentDownward(this, 'Menu')
    },

    partials() {
      return this.$route.path.split('/')
    },

    // 设置当前展开的菜单
    openNames() {
      this.$nextTick(() => {
        // 更新展开的子目录
        /* eslint no-param-reassign: ["error", { "props": false }] */
        const items = this.findComponentsDownward(this.menuCom, 'Submenu')
        if (items.length) {
          items.forEach((item) => {
            item.opened = this.menuCom.openNames.indexOf(item.name) > -1
          })
        }
      })
      return [`front${this.partials.slice(0, 2).join('.')}`]
    },

    // Menu组件不使用router-link来转跳路由
    // 这里必须手动查看路由，以便通知Menu组件当前应该高亮的项目
    activeName() {
      // 不管路由层级有多深，这里实际拼接时都只取前3层
      // 以保证进入深层级路由时，菜单仍然能正确高亮其所属父级项目
      return `front${this.partials.slice(0, 3).join('.')}`
    },
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
}
</script>

<style lang="less">
@import "~vars";

.app-menu {
  .ivu-menu-submenu-title {
    font-size: 16px;
  }
}

.app-menu__link-item {
  .ivu-menu-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-left: 46px !important;
    border-right-width: 3px !important;
    font-size: 16px;

    &:hover {
      background-color: transparent;
    }
  }

  .ivu-menu-submenu-title-icon {
    display: none;
  }

  &.ivu-menu-item-active {
    color: @primary-color;
  }
}
</style>
