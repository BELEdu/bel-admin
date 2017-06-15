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
        <h2>学员知识点</h2>
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
  * 学员管理 - 学员知识点
  * @author zml
  * @version 2017-06-08
  * @version 2017-06-13
  * @version 2017-06-15
  */
import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import fdata from './fdata'

export default {
   name: 'app-student-knowledgepoint',

   data() {
     return {
       // 搜索表单
       formSearch: {
         start: '',
         end: '',
         keyword: '',
       },
       // 表格配置
       columns: [
         { title: '学员姓名', key: 1, align: 'center', width: 110 },
         {
           title: '当前状态',
           key: 'status',
           align: 'center',
           render: (h, params) => {
             const row = params.row
             // eslint-disable-next-line
             const color = row.status === '上课' ? 'blue' : row.status === '未签约' ? 'yellow' : row.status === '结课' ? 'green' : 'red'
             const text = row.status
             return h('Tag', {
               props: {
                 type: 'dot',
                 color,
               },
             }, text)
           },
         },
         { title: '当前年级', key: 3, align: 'center' },
         { title: '学科', key: 4, align: 'center', width: 200 },
         { title: '签约课时', key: 5, align: 'center' },
         {
           title: '剩余课时',
           key: 'time',
           align: 'center',
           // 剩余课时小于10的时候变红
           render: (h, params) => {
             const row = params.row
             const className = +row.time < 10 ? 'color-error' : ''
             const text = row.time
             return h('span', {
               class: className,
             }, text)
           },
         },
         { title: '教材版本', key: 7, align: 'center' },
         { title: '知识点', key: 8, align: 'center', width: 80 },
         {
           title: '知识点',
           key: 'point',
           align: 'center',
           width: 200,
           render: (h, params) => {
             const row = params.row
             const point = row.point
             return h('Progress', {
               props: {
                 percent: point,
               },
             })
           },
         },
         {
           title: '操作',
           key: 10,
           align: 'center',
           width: 140,
           render: createButton([
            { icon: 'clipboard', type: 'primary', click: () => this.$router.push('/student/knowledgepoint/edit') },
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
