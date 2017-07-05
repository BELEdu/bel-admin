<template>
  <div>

    <Tabs class="app-tabs" @on-click="subjectSelect">
      <Tab-pane label="数学" name="math"></Tab-pane>
      <Tab-pane label="英语" name="english"></Tab-pane>
      <Tab-pane label="语文" name="chinese"></Tab-pane>
    </Tabs>

    <Tabs class="app-tabs" @on-click="tabSelect">
      <Tab-pane label="高中" name="high"></Tab-pane>
      <Tab-pane label="初中" name="middle"></Tab-pane>
      <Tab-pane label="小学" name="primary"></Tab-pane>
    </Tabs>

    <Table class="app-table point-table" :columns="columns" :data="ddata" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 详情主组件 - 学习进度子组件
 * @author zml
 * @version 2017-07-04
 */

import { GLOBAL } from '@/store/mutationTypes'
import ddata from '../Data/ddata'

export default {
  name: 'app-student-studyprogress-detail-progress',

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

  data() {
    return {
      //  科目列表
      subjects: [
        {
          label: '英语',
          name: 'english',
        },
        {
          label: '数学',
          name: 'math',
        },
        {
          label: '语文',
          name: 'chinese',
        },
      ],

      columns: [
        { title: '知识点', key: 1, align: 'center' },
        { title: ' ', key: 2, align: 'center' },
        {
          title: ' ',
          key: 'point',
          align: 'left',
          width: 500,
          render: (h, params) => {
            const { point } = params.row
            return h(
              'div',
              point.map(({ name }) => h('div', {
                class: 'table-item',
              }, name)),
            )
          },
        },
        {
          title: '完成情况',
          key: 'point',
          align: 'center',
          render: (h, params) => {
            const { point } = params.row
            return h(
              'div',
              point.map(({ ok }) => h('Icon', {
                class: ['table-item', 'color-primary'],
                props: {
                  type: ok ? 'checkmark' : '',
                },
              })),
            )
          },
        },
      ],

      ddata,

      pager: undefined,
    }
  },

  methods: {
    subjectSelect(name) {
      this.$Message.info(`你选择了${name}`)
    },
    tabSelect(name) {
      this.$Message.info(`你选择了${name}`)
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
    this.$route.meta.breadcrumb[1].link = `/student/studyprogress/${this.type}`
  },
}
</script>

<style lang="less">
@import "~vars.less";
.point-table {

  td .ivu-table-cell {
    padding: 0;
  }

  .ivu-table-cell {

    .table-item {
      border-bottom: 1px solid #e3e8ee;
      display: block;
      line-height: 30px;
      min-height: 30px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 5px;

      &:last-child {
        border-bottom: 0;
      }

      &.ivu-rate {
        font-size: 14px
      }
    }
  }
}
</style>

