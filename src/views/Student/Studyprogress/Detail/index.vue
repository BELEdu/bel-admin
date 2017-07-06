<template>
  <div>
    <Tabs :value="tabActive" type="card" :animated="false" @on-click="tabSelect" class="app-tabs">
      <Tab-pane label="学习进度" name="progress"></Tab-pane>
      <Tab-pane label="学习计划" name="plan"></Tab-pane>
      <Tab-pane label="历史计划" name="history"></Tab-pane>
      <div slot="extra">
        <Tag type="dot" color="blue" v-if="type === 'student'"><b>学员姓名</b>： {{studentName}} </Tag>
        <Tag type="dot" color="yellow" v-if="type === 'student'"><b>学管师</b>： {{teacher}} </Tag>
        <Tag type="dot" color="blue" v-if="type === 'classes'"><b> 班级 </b>： {{classesName}} </Tag>
        <Tag type="dot" color="yellow" v-if="type === 'classes'"><b>班主任</b>： {{classes_director}} </Tag>
      </div>
    </Tabs>

    <router-view
      :type="type"
      :id="id"
      :isStudent="isStudent"
      :editInfo="edit_info"
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
      tabActive: '',
      studentName: '', // 学员名称
      teacher: '', // 学管师
      classesName: '', // 班级名称
      classes_director: '', // 班主任
      edit_info: [], // 科目切换
    }
  },

  computed: {
    type() {
      return this.$router.currentRoute.params.type
    },
    id() {
      return this.$router.currentRoute.params.id
    },
    isStudent() {
      return this.type === 'student'
    },
  },

  methods: {
    tabSelect(name) {
      this.$router.push(`/student/studyprogress/${this.type}/${this.id}/${name}`)
    },
    getStudentInfo() {
      return this.$http.get(`/studentplan/infolist/${this.id}`)
        .then((res) => {
          this.studentName = res.info.display_name
          this.teacher = res.info.belong_customer_relationships
          this.edit_info = res.info.edit_info
        })
    },

    getClassesInfo() {
      return this.$http.get(`/classesplan/infolist/${this.id}`)
        .then((res) => {
          this.classesName = res.info.display_name
          this.classes_director = res.info.classes_director
          this.edit_info = res.info.edit_info
        })
    },
  },

  created() {
    (this.isStudent ? this.getStudentInfo : this.getClassesInfo)()
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))

    this.$store.commit(GLOBAL.LOADING.HIDE)
    const pathArry = this.$route.path.split('/')
    this.tabActive = pathArry[pathArry.length - 1]
  },
}
</script>

<style lang="less">
@import "~vars.less";
</style>

