<template>
  <div>

    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键字">
          <Select v-model="likeKey" slot="prepend" style="width:7em;">
            <Option v-for="likeKey in likeKeys" :key="likeKey.value" :value="likeKey.value">{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Select v-model="query.equal.current_grade" style="width:8em;" placeholder="请选择年级" >
          <Option v-for="grade in grades" :value="grade.value" :key="grade.display_name">{{ grade.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>学习进度</h2>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 学员列表
 * @author zml
 * @version 2017-07-06
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'
// import sdata from './Data/sdata'

export default {
  name: 'app-student-studyprogress-student',

  mixins: [list],

  data() {
    return {
      likeKeys: [
        { label: '学员姓名', value: 'display_name' },
        { label: '归属学管师', value: 'belong_customer_relationships_name' },
      ],
      likeKey: 'display_name',
      query: {
        equal: {
          current_grade: null,
        },
      },
       // 表格配置
      columns: [
        {
          title: '学员姓名',
          key: 'display_name',
          align: 'center',
          render: (h, params) => {
            const { display_name, number } = params.row
            return h('Tooltip', {
              class: 'color-primary',
              props: {
                content: number,
                placement: 'right',
              },
            }, display_name)
          },
        },
        { title: '当前年级', key: 'current_grade_name', align: 'center' },
        { title: '归属学管师', key: 'belong_customer_relationships_name', align: 'center' },
        { title: '签约课时', key: 'course_remain', align: 'center', sortable: 'custom' },
        { title: '剩余课时', key: 'course_remain', align: 'center', sortable: 'custom' },
        {
          title: '计划课时',
          key: 'class',
          align: 'left',
          width: '200',
          render: (h, params) => {
            const { plan_course_cost_total, plan_course_total } = params.row
            const text = `计划总课时：${plan_course_total}`
             // eslint-disable-next-line
            const percent = plan_course_total === 0 ? 0 : Math.round(plan_course_cost_total / plan_course_total * 100)
            // const percent = Math.round(point_now / point_total *10000)/100 //保留小数点后两位
            return h('div', [
              h('span', text),
              h('Progress', {
                props: {
                  percent,
                  status: 'active',
                },
              }),
            ])
          },
        },
        {
          title: '学习知识点进度',
          key: 'point',
          align: 'left',
          width: '200',
          render: (h, params) => {
            const { plan_knowledge_cost_total, plan_knowledge_total } = params.row
            const text = `总知识点：${plan_knowledge_total}个`
             // eslint-disable-next-line
            const percent = plan_knowledge_total === 0 ? 0 : Math.round(plan_knowledge_cost_total / plan_knowledge_total * 100)
            // const percent = Math.round(point_now / point_total *10000)/100 //保留小数点后两位
            return h('div', [
              h('span', text),
              h('Progress', {
                props: {
                  percent,
                  status: 'active',
                },
              }),
            ])
          },
        },
        {
          title: '操作',
          key: 8,
          align: 'center',
          width: 300,
          render: createButton([
            { text: '学习进度', type: 'primary', click: row => this.$router.push(`/student/studyprogress/student/${row.id}/progress`), isShow: ({ row }) => row.is_history },
            { text: '编辑计划', type: 'primary', click: row => this.$router.push(`/student/studyprogress/student/${row.id}/plan`), isShow: ({ row }) => row.is_history },
            { text: '添加计划', type: 'primary', click: row => this.$router.push(`/student/studyprogress/student/${row.id}/add`) },
            { text: '历史计划', type: 'primary', click: row => this.$router.push(`/student/studyprogress/student/${row.id}/history`), isShow: ({ row }) => row.is_history },
          ]),
        },
      ],
    }
  },

  computed: {
    // 使用mapState获取list
    ...mapState({
      list: state => state.student.studyprogress.list,
      grades: state => state.dicts.grade,
    }),
  },

  methods: {
    getData(qs) {
      return this.$store.dispatch(STUDENT.STUDYPROGRESS.STUDENT.INIT, qs)
    },
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
