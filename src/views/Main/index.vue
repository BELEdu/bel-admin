<template>
  <div id="app">
    <!--站点头部-->
    <app-header></app-header>

    <div class="app-body">
      <!--左侧导航-->
      <app-menu></app-menu>
      <!--右侧主内容区-->
      <div class="app-main">
        <!--面包屑导航-->
        <div class="app-content">
          <Breadcrumb class="app-creadcrumb">
            <Breadcrumb-item v-for="item in breadcrumb" :key="item">
              {{ item.name }}
            </Breadcrumb-item>
          </Breadcrumb>
          <router-view></router-view>
        </div>

        <!--站点底部-->
        <app-footer></app-footer>

        <!--数据加载动画-->
        <Spin size="large" fix v-show="$store.state.loading"></Spin>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 主应用内容
 * @author lmh
 * @version 2017-06-06
 */

import { mapState } from 'vuex'
import AppHeader from '@/components/AppHeader'
import AppMenu from '@/components/AppMenu'
import AppFooter from '@/components/AppFooter'

export default {
  name: 'app',

  computed: {
    ...mapState(['token']),

    breadcrumb() {
      return this.$route.meta.breadcrumb
    },
  },

  components: {
    AppHeader,
    AppMenu,
    AppFooter,
  },

  created() {
    // 如果用户未登录，转跳到登陆页
    // if (!this.token) {
    //   this.$router.push('/login')
    // }
  },
}
</script>

<style lang="less">
// ie9不支持css动画，spin组件不应该显示出来
// 若要在ie9下也显示加载动画，应该使用gif或svg动画？
.ie {
  .ivu-spin {
    display: none !important;
  }
}
</style>
