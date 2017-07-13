<template>
  <div>
    <!--条件查询模块-->
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键字">
          <Select v-model="likeKey" slot="prepend" style="width:6em">
            <Option v-for="likeKey in likeKeys"
                    :key="likeKey.value"
                    :value="likeKey.value">{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <!--列表工具模块-->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2><Icon type="ios-calendar" /> 学员列表</h2>
      </Col>
      <Col>
      <Button type="primary" @click="$router.push('/curriculum/student/timetable/2')">打印</Button>
      </Col>
    </Row>

    <!--列表数据模块-->
    <Table class="app-table" :columns="studentColumns" :data="studentData.data" @on-sort-change="sort" border></Table>
    <app-pager :data="studentData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>
  </div>
</template>

<script>
  /**
   * 学员排课
   * @author    chenliangshan
   * @version   2017/06/28
   */

import { createButton } from '@/utils'
import { list } from '@/mixins'

  export default {
    name: 'app-curriculum-student-list',
    mixins: [list],
    data() {
      return {
        // 搜索字段
        likeKeys: [
          { label: '学员姓名', value: 'display_name' },
          { label: '学员编号', value: 'number' },
          { label: '学管师', value: 'belong_customer_relationships' },
        ],
        // 默认模糊字段
        likeKey: 'display_name',
        // 学员字段
        studentColumns: [
          { title: '学员姓名', key: 'display_name', align: 'center' },
          { title: '学员编号', key: 'number', align: 'center', sortable: 'custom' },
          {
            title: '当前年级',
            align: 'center',
            render: (h, params) => h('app-dicts-filter', { props: { value: params.row.current_grade, name: 'grade' } }) },
          { title: '学管师', key: 'belong_customer_relationships', align: 'center' },
          { title: '产品名称', key: 'schedule_product_name', align: 'center' },
          { title: '签约课时', key: 'course_total', align: 'center', sortable: 'custom' },
          { title: '剩余课时', key: 'course_remain', align: 'center', sortable: 'custom' },
          {
            title: '操作',
            align: 'center',
            render: createButton([
              {
                icon: 'edit',
                type: 'primary',
                click: (params) => {
                  this.$router.push(`/curriculum/studentcurricula/student/course/${params.id}`)
                },
                text: '排课管理',
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
        return this.$http.get(`/studentcurricula${qs}`)
          .then((data) => {
            this.studentData = data
          })
      },
    },
  }
</script>

<style lang="less">

</style>
