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
      <h2><Icon type="document-text" /> 学员列表</h2>
      </Col>
    </Row>

    <!--列表数据模块-->
    <Table class="app-table" :columns="studentColumns" :data="studentData.data" @on-sort-change="sort" border></Table>
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
      likeKeys: [
        { label: '学员姓名', value: 'display_name' },
        { label: '学员编号', value: 'number' },
        { label: '学管师', value: 'counsellor_name' },
      ],
      likeKey: 'display_name', // 默认模糊字段
      // 学员字段
      studentColumns: [
        { title: '学员姓名', key: 'display_name', align: 'center', width: 160 },
        { title: '学员编号', key: 'number', align: 'center', width: 180, sortable: 'custom' },
        { title: '上课年级', key: 'current_grade_name', align: 'center' },
        { title: '产品名称', key: 'schedule_product_name', align: 'center' },
        { title: '学管师', key: 'counsellor_name', align: 'center' },
        {
          title: '操作',
          align: 'center',
          width: 100,
          render: createButton([
            {
              type: 'primary',
              click: (params) => {
                this.$router.push(`/curriculum/curricularecord/student/show/${params.id}`)
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
