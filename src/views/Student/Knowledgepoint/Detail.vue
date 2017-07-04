<template>
  <div>

    <Tabs :value="tabActive" type="card" @on-click="tabSelect" class="app-tabs">
      <Tab-pane v-for="item in subjects" :key="item.name" :label="item.label" :name="item.name"></Tab-pane>
    </Tabs>

    <Tabs value="high" >
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
 * 学员管理 - 学员知识点 - 学员知识点详情
 * @author zml
 * @version 2017-06-30
*/
import { GLOBAL } from '@/store/mutationTypes'
import ddata from './ddata'

export default {

  name: 'app-student-knowledgepoint-detail',

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
        { title: ' ',
          key: 'point',
          align: 'center',
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
        { title: '教授情况（%）', key: 3, align: 'center' },
        { title: ' ',
          key: 'point',
          align: 'center',
          render: (h, params) => {
            const { point } = params.row
            return h(
              'div',
              point.map(({ before }) => h('Rate', {
                class: 'table-item',
                props: {
                  value: before,
                  disabled: true,
                },
              })),
            )
          },
        },
        { title: '测试情况（次）', key: 4, align: 'center' },
        { title: ' ',
          key: 'point',
          align: 'center',
          render: (h, params) => {
            const { point } = params.row
            return h(
              'div',
              point.map(({ now }) => h('Rate', {
                class: 'table-item',
                props: {
                  value: now,
                  disabled: true,
                },
              })),
            )
          },
        },
      ],

      tabActive: '',
      // 表格数据
      ddata,
      // 分页配置
      pager: undefined,
    }
  },

  methods: {
    tabSelect(name) {
      this.$Message.info(`你选择了${name}`)
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>
<style lang="less">
  .point-table {

    td .ivu-table-cell{
      padding: 0;
    }

    .ivu-table-cell {

      .table-item {
        border-bottom: 1px solid #e3e8ee;
        display: block;
        line-height: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 5px;

        &:last-child {
          border-bottom:0;
        }

        &.ivu-rate {
          font-size: 14px
        }
      }
    }
  }
</style>
