<template>
  <div>

    <Tabs class="app-tabs" @on-click="tabSelect">
        <Tab-pane label="暂时没有进行中的学习进度" v-if="editInfo.length===0"></Tab-pane>
        <Tab-pane v-for="item in editInfo" :key="item.id" :label="`${item.subject_type_name}，计划id：${item.id}`"></Tab-pane>
    </Tabs>

    <Steps :current="1">
        <Step title="已完成" content="第1节课"></Step>
        <Step title="进行中" content="第5节课"></Step>
        <Step title="待进行" content="第6节课"></Step>
        <Step title="待进行" content="第10节课"></Step>
    </Steps>

    <!-- 学习进度表格组件 -->
    <progress-table :planId="planId" v-if="planId"></progress-table>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>测试数据（旧版本原型）</h2>
      </Col>
    </Row>

    <Table class="app-table point-table" :columns="columns" :data="ddata" border></Table>

  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 详情主组件 - 学习进度子组件
 * @author zml
 * @version 2017-07-04
 */

import ddata from '../Data/ddata'
import ProgressTable from '../components/ProgressTable'

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
    editInfo: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {

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

      ddata, // 知识点假数据

      planIndex: 0,
    }
  },

  components: {
    ProgressTable,
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
    tabSelect(index) {
      this.planIndex = index
    },
  },

  created() {
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

