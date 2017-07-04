<template>
  <div>
    <Tabs class="app-tabs" @on-click="tabSelect">
        <Tab-pane label="数学" name="math"></Tab-pane>
        <Tab-pane label="英语" name="english"></Tab-pane>
        <Tab-pane label="语文" name="chinese"></Tab-pane>
        <Button type="primary" icon="plus" @click="addPlan" size="small" slot="extra">添加计划</Button>
    </Tabs>

    <edit-plan :initialStep="4"></edit-plan>

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
  },

  methods: {
    addPlan() {
      this.$router.push(`/student/studyprogress/${this.type}/${this.id}/add`)
    },
    tabSelect(name) {
      this.$Message.info(`你选择了${name}`)
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

