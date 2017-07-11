<template>
  <div>
    <!--科目tabs-->
    <Tabs class="app-tabs" @on-click="tabSelect">
        <Tab-pane v-for="item in editInfo" :key="item.id" :label="`科目id：${item.subject_type}，计划id：${item.id}`"></Tab-pane>
        <Button type="primary" icon="plus" @click="addPlan" size="small" slot="extra">添加计划</Button>
    </Tabs>

    <edit-plan :initialStep="4" :planId="planId" v-if="planId"></edit-plan>

  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 详情主组件 - 学习计划子组件
 * @author zml
 * @version 2017-07-04
 */

import { GLOBAL } from '@/store/mutationTypes'
import EditPlan from '../components/EditPlan'

export default {
  name: 'app-student-studyprogress-detail-plan',

  props: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: [Number, String],
      required: true,
    },
    editInfo: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      planIndex: 0,
    }
  },

  computed: {
    planId() {
      if (this.editInfo.length) {
        return this.editInfo[this.planIndex].id
      }
      return null
    },
  },

  methods: {
    addPlan() {
      this.$router.push(`/student/studyprogress/${this.type}/${this.id}/add`)
    },
    tabSelect(index) {
      this.planIndex = index
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

