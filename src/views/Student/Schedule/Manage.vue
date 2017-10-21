<template>
  <div class="student-schedule-manage">
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
   * 排课管理 - 切换标签 - 公用
   * @author  chenliangshan
   * @version 2017-10-19
   */

  import { list } from '@/mixins'

  export default {
    name: 'student-schedule-manage',

    mixins: [list],

    data() {
      return {

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
