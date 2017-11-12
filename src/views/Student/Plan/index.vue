<template>
  <div class="student-plan">
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键字">
        <Select v-model="likeKey" slot="prepend" style="width:6em;">
          <Option v-for="key in likeKeys" :key="key.value" :value="key.value">{{ key.label }}</Option>
        </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Select v-model="query[`equal[plan_status]`]" placeholder="请选择状态" style="width:9em;">
          <Option value="">全部</Option>
          <Option :value="0">未计划</Option>
          <Option :value="1">计划中</Option>
          <Option :value="3">已取消</Option>
          <Option :value="4">已结束</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2><Icon type="ios-barcode"/> 学习计划</h2>
      </Col>
    </Row>

    <!--班级管理表格-->
    <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <!--分页-->
    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--计划弹窗-->
    <plan-modal :visible.sync="planVisible" @on-success="fetchData"></plan-modal>
  </div>
</template>

<script>
  /**
   * 学习计划
   * @author chenliangshan
   * @version 2017-10-12
   */

  import { mapState } from 'vuex'
  import { list } from '@/mixins'
  import { STUDENT } from '@/store/mutationTypes'
  import { createButton } from '@/utils'
  import PlanModal from './components/PlanModal'

  export default {
    name: 'student-plan',

    mixins: [list],

    components: { PlanModal },

    data() {
      return {
        likeKeys: [
          { label: '班级名称', value: 'classes_name' },
          { label: '排课专员', value: 'customer_relationships_name' },
        ],

        likeKey: 'classes_name',

        query: {
          'equal[plan_status]': null,
        },

        columns: [
          { title: '班级名称', key: 'classes_name', align: 'center' },
          { title: '学员人数（个）', key: 'student_total', width: 120, align: 'center' },
          { title: '排课专员', key: 'customer_relationships_name', width: 160, align: 'center' },
          { title: '课时进度',
            align: 'center',
            width: 300,
            render: (h, params) => {
              const cost = params.row.course_cost ?
                (params.row.course_cost / params.row.course_all) * 100 : 0
              return [
                h('span', {
                  style: {
                    width: '100px',
                    display: 'inline-block',
                    float: 'left',
                  },
                }, `总课时：${params.row.course_total}`),
                h('Progress', {
                  style: {
                    width: '170px',
                    display: 'inline-block',
                    float: 'right',
                    textAlign: 'left',
                  },
                  props: {
                    percent: parseFloat(cost.toFixed(2)),
                  },
                }),
              ]
            },
          },
          { title: '状态', key: 'plan_status_name', width: 80, align: 'center' },
          { title: '操作',
            align: 'center',
            width: 180,
            render: createButton([
              // 未计划
              { text: '添加计划',
                type: 'primary',
                isShow: ({ row }) => row.plan_operation.store,
                click: (row) => {
                  this.handlePlan(row, 'add')
                },
              },
              // 计划中 || 已结束
              { text: '查看进度',
                type: 'primary',
                isShow: ({ row }) => row.plan_operation.show,
                click: (row) => {
                  this.handlePlan(row, 'view')
                },
              },
              // 计划中
              { text: '编辑计划',
                type: 'primary',
                isShow: ({ row }) => row.plan_operation.update,
                click: (row) => {
                  this.handlePlan(row, 'edit')
                },
              },
            ]),
          },
        ],

        planVisible: false,
      }
    },

    computed: {
      ...mapState({
        list: state => state.student.plan.list,
      }),
    },

    methods: {
      getData(qs) {
        return this.$store.dispatch(STUDENT.PLAN.INIT, qs)
      },

      handlePlan(item, type) {
        this.$store.commit(STUDENT.PLAN.CURRENT_ITEM_DATA, item)
        this.$store.commit(STUDENT.PLAN.CURRENT_ITEM_TYPE, type)
        if (type !== 'view') {
          this.$store.dispatch(STUDENT.PLAN.CURRENT_ITEM_STORE, `${item.id}`)
        }
        if (type === 'edit') {
          // 请求异步数据
          this.$store.dispatch(STUDENT.PLAN.FETCH_COACH_LIST)
        }
        this.planVisible = true
      },
    },
  }
</script>

<style lang="less">
  .student-plan {
    .ivu-progress-show-info .ivu-progress-outer {
      padding-right: 58px;
      margin-right: -58px;
    }
  }
</style>
