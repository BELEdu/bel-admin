<template>
  <div>
    <app-editor-title></app-editor-title>
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

    }
  },

  computed: {
    type() {
      return this.$router.currentRoute.params.type
    },
  },

  components: {
    EditPlan,
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
    this.$route.meta.breadcrumb[1].link = `/student/studyprogress/${this.type}`
  },
}
</script>

<style lang="less">
@import "~vars.less";
</style>
