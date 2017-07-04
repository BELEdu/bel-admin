<template>
  <div>

    <Tabs :value="tabActive" type="card" :animated="false" @on-click="tabSelect" class="app-tabs">
      <Tab-pane label="学习进度" name="progress"></Tab-pane>
      <Tab-pane label="学习计划" name="plan"></Tab-pane>
      <Tab-pane label="历史计划" name="history"></Tab-pane>
      <div slot="extra">
        <Tag type="dot" color="blue" v-if="type === 'student'"><b>学员姓名</b>： 李园园 </Tag>
        <Tag type="dot" color="yellow" v-if="type === 'student'"><b>学管师</b>： 王达路 </Tag>
        <Tag type="dot" color="blue" v-if="type === 'classes'"><b> 班级 </b>： 奥数小班 </Tag>
        <Tag type="dot" color="yellow" v-if="type === 'classes'"><b>班主任</b>： 王达路 </Tag>
      </div>
    </Tabs>

    <router-view :type="type" :id="id" ></router-view>

  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 详情主组件
 * @author zml
 * @version 2017-07-04
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-student-studyprogress-detail',

  data() {
    return {
      tabActive: '',
    }
  },

  computed: {
    type() {
      return this.$router.currentRoute.params.type
    },
    id() {
      return this.$router.currentRoute.params.id
    },
  },

  methods: {
    tabSelect(name) {
      this.$router.push(`/student/studyprogress/${this.type}/${this.id}/${name}`)
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
    const pathArry = this.$route.path.split('/')
    this.tabActive = pathArry[pathArry.length - 1]
  },
}
</script>

<style lang="less">
@import "~vars.less";
</style>

