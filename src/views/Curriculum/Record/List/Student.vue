<template>
  <div>
    <!--条件查询模块-->
    <Form inline class="app-search-form">
      <Form-item prop="start">
        <Input v-model="form.keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <!--列表工具模块-->
    <Row class="app-content-header" type="flex" justify="end">
    </Row>

    <!--列表数据模块-->
    <Table class="app-table" :columns="studentColumns" :data="studentData.data" border></Table>
    <app-pager :data="studentData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>
  </div>
</template>

<script>
/**
 * 课程管理 - 学员上课记录
 * @author chenliangshan
 * @version 2017/07/01
 */

import { createButton } from '@/utils'
import { list } from '@/mixins'

export default {
  name: 'app-student-record',
  mixins: [list],
  data() {
    return {
      // 搜索字段
      form: {
        keyword: '',
      },
      // 学员字段
      studentColumns: [
        { title: '学员姓名', key: 'display_name', align: 'center' },
        { title: '学员编号', key: 'number', align: 'center' },
        { title: '上课年级',
          align: 'center',
          render: (h, params) => h('app-dicts-filter', { props: { value: params.row.current_grade, name: 'grade' } }) },
        { title: '产品名称', key: 'schedule_product_name', align: 'center' },
        { title: '学管师', key: 'belong_customer_relationships', align: 'center' },
        {
          title: '操作',
          align: 'center',
          render: createButton([
            {
              type: 'primary',
              click: (params) => {
                this.$router.push(`/curriculum/record/show/${params.id}`)
              },
              text: '查看',
            },
          ]),
        },
      ],
      // 学员数据
      studentData: {},
    }
  },
  methods: {
    // 获取学员数据
    getData(qs) {
      return this.$http.get(`/curricularecord/student/information${qs}`)
        .then((data) => {
          this.studentData = data
        })
    },
  },
}
</script>

<style lang="less">
  .modal-header {
    span {
      padding-right: 10px;
    }
  }
</style>
