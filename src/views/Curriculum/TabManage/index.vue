<template>
  <div>
    <Tabs :value="tabActive" type="card" :animated="false" @on-click="tabSwitch" class="app-tabs">
      <template v-for="tab in $route.meta.tabName">
        <Tab-pane :label="tab.name" :name="tab.value"></Tab-pane>
      </template>
    </Tabs>
    <router-view></router-view>
  </div>
</template>

<script>
/**
 * 切换标签 - 公用
 * @author chenliangshan
 * @version 2017-07-01
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-curriculum-tab-manage',
  data() {
    return {
      currentType: [],
    }
  },
  computed: {
    qs() {
      return this.$parse(this.$route.query)
    },
    tabActive() {
      this.$store.commit(GLOBAL.LOADING.HIDE)
      const pathArry = this.$route.path.split('/')
      return pathArry[pathArry.length - 2]
    },
  },
  methods: {
    // 标签切换事件
    tabSwitch(name) {
      return this.updateRoute(name)
    },
    // 更新路由
    updateRoute(name, qs = '') {
      const path = this.$route.path.replace(this.tabActive, name)
      this.$router.push(`${path}${qs}`)
    },
  },
}
</script>
