<template>
  <div>

    <Tabs :value="tabActive" type="card" :animated="false" @on-click="tabSelect" class="app-tabs">
      <Tab-pane label="学员" name="student"></Tab-pane>
      <Tab-pane label="班级" name="classes"></Tab-pane>
    </Tabs>

    <router-view></router-view>

  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 主组件
 * @author zml
 * @version 2017-07-01
 */
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-student-studyprogress',

  data() {
    return {
      tabActive: '',
    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
    const pathArry = this.$route.path.split('/')
    this.tabActive = pathArry[pathArry.length - 1]
  },

  methods: {
    tabSelect(name) {
      this.$router.push(`/student/studyprogress/${name}`)
    },
  },

}
</script>

<style <style lang="less">
@import '~vars';
</style>
