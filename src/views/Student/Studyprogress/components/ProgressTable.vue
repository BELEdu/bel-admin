<template>
<div>

  <Tabs class="app-tabs" @on-click="gradeSelect">
    <Tab-pane label="高中" name="high"></Tab-pane>
    <Tab-pane label="初中" name="middle"></Tab-pane>
    <Tab-pane label="小学" name="primary"></Tab-pane>
  </Tabs>

  <Table size="small" class="app-table point-table" :columns="columns" :data="data" border></Table>

</div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 学习进度通用表格组件
 * @author zml
 * @version 2017-07-26
 */
import { GLOBAL } from '@/store/mutationTypes'

export default {

  name: 'app-student-studyprogress-table',

  props: {
    planId: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      data: [],
      columns: [
        { title: '知识点', key: 'knowledge_id', align: 'center' },
        {
          title: '教授情况',
          key: 'teach_status_name',
          align: 'center',
          render: (h, params) => {
            const { teach_status } = params.row
            return h('Icon', {
              class: teach_status === 0 ? 'color-primary' : 'color-error',
              props: {
                type: teach_status === 0 ? 'checkmark' : 'close',
              },
            })
          },
        },
        { title: '原来掌握情况', key: 'old_status_name', align: 'center' },
        { title: '最新掌握情况', key: 'new_status_name', align: 'center' },
        { title: '测试情况', key: 'test_number', align: 'center' },
      ],
    }
  },

  computed: {
    id() { // 学生或者班级id（从路由获得）
      return +this.$router.currentRoute.params.id
    },

    type() { // 班级进度还是学员进度（从路由获得）
      return this.$router.currentRoute.params.type
    },

    isStudent() {
      return this.type === 'student'
    },
  },

  watch: {
    planId() {
      this.getProgressData()
    },
  },

  methods: {
    getProgressData() {
      const api = this.isStudent ? `/studentprogress/infoknowledge/${this.planId}` : `/classesprogress/infoknowledge/${this.planId}`
      return this.$http.get(api)
        .then((res) => {
          this.data = res.plan_knowledge_pivot
        })
    },

    gradeSelect(name) {
      this.$Message.info(`你选择了${name}`)
    },
  },

  created() {
    this.getProgressData()
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },

}
</script>

<style lang="less">
@import "~vars.less";
</style>
