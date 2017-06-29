<template>
  <div>
    <Tabs :value="tabActive" type="card" :animated="false" @on-click="tabSwitch" class="app-tabs">
      <Tab-pane label="日课表" name="date"></Tab-pane>
      <Tab-pane label="周课表" name="week"></Tab-pane>
    </Tabs>
    <router-view></router-view>
  </div>
</template>

<script>
/**
 * 排课管理 - 排课表
 * @author chenliangshan
 * @version 2017-06-29
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-curriculum-course-manage',
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
