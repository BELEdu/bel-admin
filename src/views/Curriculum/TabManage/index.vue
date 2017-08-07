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
 * @author  chenliangshan
 * @version 2017-07-01
 */

export default {
  name: 'app-curriculum-tab-manage',
  data() {
    return {
      currentType: [],
    }
  },
  computed: {
    tabActive() {
      const pathArry = this.$route.path.split('/')
      return pathArry[pathArry.length - this.currentId]
    },
    currentId() {
      return this.$route.params.id ? 2 : 1
    },
  },
  methods: {
    // 标签切换事件
    tabSwitch(name) {
      return this.updateRoute(name)
    },
    // 更新路由
    updateRoute(name) {
      const pathArry = this.$route.path.split('/')
      pathArry[pathArry.length - this.currentId] = name
      this.$router.push(`${pathArry.join('/')}`)
    },
  },
}
</script>
