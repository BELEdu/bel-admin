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
        <h2><Icon type="ios-browsers"/> 学习计划</h2>
      </Col>
    </Row>

    <!--班级管理表格-->
    <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <!--分页-->
    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--计划弹窗-->
    <plan-modal :visible.sync="planVisible" :item="currentItem" type="add"></plan-modal>
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
          { title: '学员人数（个）', key: 'student_total', align: 'center' },
          { title: '排课专员', key: 'customer_relationships_name', align: 'center' },
          { title: '课时进度',
            align: 'center',
            width: 280,
            render: (h, params) => {
              const cost = params.row.course_cost ?
                (params.row.course_cost / params.row.course_total) * 100 : 0
              return [
                h('span', null, `总课时：${params.row.course_total}`),
                h('Progress', {
                  style: {
                    width: '170px',
                  },
                  props: {
                    percent: cost,
                  },
                }),
              ]
            },
          },
          { title: '状态', key: 'plan_status_name', align: 'center' },
          { title: '操作',
            align: 'center',
            width: 180,
            render: createButton([
              // 未计划
              { text: '添加计划',
                type: 'primary',
                isShow: ({ row }) => row.plan_status === 0,
                click: (row) => {
                  // eslint-disable-next-line
                  console.log(row)
                  // TODO 晚辅导
                  this.addPlan(row)
                  // TODO 其它计划
                },
              },
              // 计划中 || 已结束
              { text: '查看进度',
                type: 'primary',
                isShow: ({ row }) => row.plan_status === 1 || row.plan_status === 4,
                click: (row) => {
                  // eslint-disable-next-line
                  console.log(row)
                },
              },
              // 计划中
              { text: '编辑计划',
                type: 'primary',
                isShow: ({ row }) => row.plan_status === 1,
                click: (row) => {
                  // eslint-disable-next-line
                  console.log(row)
                },
              },
            ]),
          },
        ],
        currentItem: {},
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

      addPlan(item) {
        this.currentItem = { ...item }
        this.planVisible = true
      },
    },
  }
</script>