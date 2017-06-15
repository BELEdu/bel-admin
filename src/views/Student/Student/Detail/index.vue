<template>
  <div>
    <Tabs :value="tabActive" type="card" :animated="false" @on-click="tabSelect" >
      <Tab-pane label="基础信息" name="edit"></Tab-pane>
      <Tab-pane label="交流会" name="meeting"></Tab-pane>
      <Tab-pane label="预警信息" name="warning"></Tab-pane>
    </Tabs>

    <router-view></router-view>

  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息 - 学员详情 - 主组件
 * @author zml
 * @version 2017-06-14
 */
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-student-student-detail',

  data() {
    return {
      // 当前激活的tab
      tabActive: '',
    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
    // 获取URL最后一个 / 后面的单词，用于判断 tab active
    const pathArry = this.$route.path.split('/')
    this.tabActive = pathArry[pathArry.length - 1]
  },

  methods: {
    // 标签栏切换
    tabSelect(name) {
      this.$router.push(`/student/student/detail/${name}`)
    },
  },

}
</script>

<style <style lang="less">

</style>
