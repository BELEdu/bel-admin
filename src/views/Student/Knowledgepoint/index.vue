<template>
  <div>
    <!-- 搜索表单 -->
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

    <!-- 操作按钮 -->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2><Icon type="ios-bookmarks"/> 学员知识点</h2>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

  </div>
</template>

<script>
 /**
  * 学员管理 - 学员知识点
  * @author zml
  * @version 2017-06-08
  * @version 2017-06-13
  * @version 2017-06-15
  */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import fdata from './fdata'

export default {
   name: 'app-student-knowledgepoint',

   mixins: [list],

   data() {
     return {

       likeKeys: [
        { label: '学员姓名', value: 'display_name' },
       ],
       likeKey: 'display_name',
       query: {
         equal: {
           current_grade: null,
         },
       },

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
         {
           title: '当前状态',
           key: 'status',
           align: 'center',
           render: (h, params) => {
             const { student_current_status, student_current_status_name } = params.row
             // eslint-disable-next-line
             const color = student_current_status === 1 ? 'blue' : student_current_status === 3 ? 'yellow' : student_current_status === 4 ? 'green' : 'red'
             const text = student_current_status_name
             return h('Tag', {
               props: {
                 type: 'dot',
                 color,
               },
             }, text)
           },
         },
         { title: '当前年级', key: 'current_grade_name', align: 'center' },
         { title: '学科', key: 4, align: 'center' },
         {
           title: '已掌握知识点',
           key: 5,
           align: 'center',
           render: (h, params) => {
             const { plan_knowledge_cost_total, plan_knowledge_total } = params.row
             const text = `${plan_knowledge_cost_total} / ${plan_knowledge_total}`
             return h('span', text)
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
           key: 10,
           align: 'center',
           width: 140,
           render: createButton([
            { text: '详情', type: 'primary', click: row => this.$router.push(`/student/knowledgepoint/${row.id}`) },
            { text: '知识点', type: 'warning' },
           ]),
         },
       ],
       // 表格数据
       fdata,
     }
   },

   computed: {
    // 使用mapState获取list
     ...mapState({
       list: state => state.student.knowledgepoint.list,
       grades: state => state.dicts.grade,
     }),
   },

   methods: {
     getData(qs) {
       return this.$store.dispatch(STUDENT.KNOWLEDGEPOINT.INIT, qs)
     },
   },

}
</script>

<style lang="less">
@import '~vars';
</style>
