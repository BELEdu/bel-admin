<template>
  <div>

    <Tabs :value="tabActive" type="card" :animated="false" @on-click="tabSelect" class="app-tabs">
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
    // 如果从学员信息进入时候，特殊处理
    if (pathArry[pathArry.length - 2] === 'meeting') {
      this.tabActive = 'meeting'
    }
    if (pathArry[pathArry.length - 3] === 'meeting') {
      this.tabActive = 'meeting'
    }
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
@import '~vars';
.app-tabs {
  margin-bottom:20px;

  &.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab {
    // border-radius: 0;
    background: #fff;
  }
  &.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active {
    border-top: 1px solid #3399ff;
  }
  &.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active:before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
