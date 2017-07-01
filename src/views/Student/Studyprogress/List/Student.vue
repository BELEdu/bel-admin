<template>
  <div>
    <!-- 搜索表单 -->
    <Form inline class="app-search-form">
      <Form-item>
        <Row>
          <Col span="11">
            <Date-picker type="date" v-model="formSearch.start" placeholder="选择日期"></Date-picker>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
            <Date-picker type="date" v-model="formSearch.end" placeholder="选择日期"></Date-picker>
          </Col>
        </Row>
      </Form-item>
      <Form-item>
        <Input type="text" v-model="formSearch.keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <!-- 操作按钮 -->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>学习进度</h2>
      </Col>
      <Col>
        <Button type="primary">按钮</Button>
      </Col>
    </Row>

    <!-- 学员信息表格 -->
    <Table class="app-table" :columns="columns" :data="fdata" border></Table>

    <!-- 分页 -->
    <app-pager :data="pager" @on-change="() => {}"></app-pager>

  </div>
</template>

<script>
 /**
  * 学员管理 - 学习进度 - 学员列表
  * @author zml
  * @version 2017-06-08
  * @version 2017-06-16
  * @version 2017-06-29
  */
import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import fdata from './fdata'


export default {
   name: 'app-student-studyprogress-list-student',

   data() {
     return {
       // 搜索栏配置
       formSearch: {
         start: '',
         end: '',
         keyword: '',
       },
       // 表格配置
       columns: [
         { title: '学员姓名', key: 1, align: 'center' },
         { title: '当前年级', key: 2, align: 'center' },
         { title: '归属学管师', key: 3, align: 'center' },
         { title: '签约课时', key: 4, align: 'center' },
         { title: '剩余课时', key: 5, align: 'center' },
         {
           title: '课时',
           key: 'calss',
           align: 'center',
           width: '200',
           render: (h, params) => {
             const row = params.row
             const point = row.calss
             return h('Progress', {
               props: {
                 percent: point,
                 status: 'active',
               },
             })
           },
         },
         {
           title: '学习知识点进度',
           key: 'point',
           align: 'center',
           width: '200',
           render: (h, params) => {
             const row = params.row
             const point = row.point
             return h('Progress', {
               props: {
                 percent: point,
                 status: 'active',
               },
             })
           },
         },
         {
           title: '操作',
           key: 8,
           align: 'center',
           width: 300,
           render: createButton([
            { text: '学习进度', type: 'primary', click: () => this.$router.push('/student/studyprogress/edit') },
            { text: '编辑计划', type: 'primary', click: () => this.$router.push('/student/studyprogress/edit') },
            { text: '添加计划', type: 'primary', click: () => this.$router.push('/student/studyprogress/edit') },
            { text: '历史计划', type: 'primary', click: () => this.$router.push('/student/studyprogress/edit') },
           ]),
         },
       ],
       // 表格数据
       fdata,
       // 分页配置
       pager: undefined,
     }
   },

   created() {
     this.$store.commit(GLOBAL.LOADING.HIDE)
   },
}
</script>

<style lang="less">
@import '~vars';
</style>
