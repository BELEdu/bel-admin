<template>
  <div>
    <app-editor-title>添加计划：{{name}}</app-editor-title>
    <edit-plan></edit-plan>
  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 添加计划
 * @author zml
 * @version 2017-07-04
 */

import { GLOBAL } from '@/store/mutationTypes'
import EditPlan from './components/EditPlan'

export default {
  name: 'app-student-studyprogress-add',

  data() {
    return {
      name: '',
    }
  },

  computed: {
    id() {
      return +this.$router.currentRoute.params.id
    },
    type() {
      return this.$router.currentRoute.params.type
    },
    isStudent() {
      return this.type === 'student'
    },
  },

  components: {
    EditPlan,
  },

  methods: {
    getStudentInfo() {
      return this.$http.get(`/studentplan/infolist/${this.id}`)
        .then((res) => {
          this.name = res.info.display_name
        })
    },

    getClassesInfo() {
      return this.$http.get(`/classesplan/infolist/${this.id}`)
        .then((res) => {
          this.name = res.info.display_name
        })
    },
  },

  created() {
    (this.isStudent ? this.getStudentInfo : this.getClassesInfo)()
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))

    this.$route.meta.breadcrumb[1].link = `/student/studyprogress/${this.type}`
  },
}
</script>

<style lang="less">
@import "~vars.less";
</style>
