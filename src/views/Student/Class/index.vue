<template>
  <div class="student-class">

    <Form inline class="app-search-form">
      <Form-item>
        <Row>
          <Col span="11">
            <Date-picker type="date" v-model="form.start" placeholder="选择日期"></Date-picker>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
            <Date-picker type="date" v-model="form.end" placeholder="选择日期"></Date-picker>
          </Col>
        </Row>
      </Form-item>
      <Form-item>
        <Input type="text" v-model="form.keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>班级管理</h2>
      </Col>
      <Col>
        <Button type="primary">添加班级</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="fdata" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>

  </div>
</template>

<script>
 /**
  * 学员管理 - 班级管理
  * @author zml
  * @version 2017-06-08
  */
import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import fdata from './fdata'

export default {
   name: 'app-student-class',

   data() {
     return {
       // 搜索栏配置
       form: {
         start: '',
         end: '',
         keyword: '',
       },
       // 表格配置
       columns: [
         { title: '员工编号', key: 1, align: 'center', width: 100 },
         { title: '用户名', key: 2, align: 'center' },
         { title: '姓名', key: 3, align: 'center' },
         { title: '手机号', key: 4, align: 'center', width: 120 },
         { title: '邮箱', key: 5, align: 'center', width: 200 },
         { title: '性别', key: 6, align: 'center', width: 60 },
         { title: '部门角色', key: 7, align: 'center', width: 180 },
         { title: '岗位性质', key: 8, align: 'center', width: 80 },
         { title: '最近登录时间', key: 9, align: 'center', width: 150 },
         { title: '状态', key: 10, align: 'center' },
         {
           title: '操作',
           key: 13,
           align: 'center',
           width: 130,
           render: createButton([
             { icon: 'person', type: 'warning' },
             { icon: 'trash-a', type: 'error' },
             { icon: 'edit', type: 'primary' },
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

<style lang="less" scoped>
@import '~vars';
</style>
