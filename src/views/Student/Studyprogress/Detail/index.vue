<template>
  <div>
    <Tabs :value="tabActive" type="card" :animated="false" @on-click="tabSelect" class="app-tabs">
      <Tab-pane label="学习进度" name="progress"></Tab-pane>
      <Tab-pane label="学习计划" name="plan"></Tab-pane>
      <Tab-pane label="历史计划" name="history"></Tab-pane>
      <div slot="extra">
        <Tag type="dot" color="blue" v-if="isStudent"><b>学员姓名</b>： {{display_name}} </Tag>
        <Tag type="dot" color="yellow" v-if="isStudent"><b>学员编号</b>： {{number}} </Tag>
        <Tag type="dot" color="blue" v-if="!isStudent"><b> 班级名称</b>： {{display_name}} </Tag>
        <Tag type="dot" color="yellow" v-if="!isStudent"><b>班级编号</b>： {{number}} </Tag>
      </div>
    </Tabs>

    <router-view
      :type="type"
      :id="id"
      :isStudent="isStudent"
      :editInfo="edit_info"
      @endPlan="endPlan"
    ></router-view>

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
      adfa: '',
      display_name: '', // 学员或班级名称
      number: '', // 学管师或班主任
      edit_info: [], // 科目切换
    }
  },

  computed: {
    type() {
      return this.$router.currentRoute.params.type
    },
    id() {
      return +this.$router.currentRoute.params.id
    },
    isStudent() {
      return this.type === 'student'
    },
    tabActive() {
      return this.$route.path.split('/').slice(-1)[0]
    },
  },

  methods: {
    tabSelect(name) {
      this.$router.push(`/student/studyprogress/${this.type}/${this.id}/${name}`)
    },

    getStudentInfo() {
      return this.$http.get(`/studentplan/infolist/${this.id}`)
        .then((res) => {
          this.display_name = res.info.display_name
          this.number = res.info.number
          this.edit_info = res.info.edit_info
        })
    },

    getClassesInfo() {
      return this.$http.get(`/classesplan/infolist/${this.id}`)
        .then((res) => {
          this.display_name = res.info.display_name
          this.number = res.info.number
          this.edit_info = res.info.edit_info
        })
    },

    endPlan(planId) { // 结束计划的时候在视图上移除该计划
      this.edit_info = this.edit_info.filter(info => info.id !== planId)
    },
  },

  created() {
    (this.isStudent ? this.getStudentInfo : this.getClassesInfo)()
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">
@import "~vars.less";
</style>

