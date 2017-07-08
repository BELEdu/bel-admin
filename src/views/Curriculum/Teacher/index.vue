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
      <h2><Icon type="ios-calendar" /> 教师列表</h2>
      </Col>
      <Button type="primary">打印</Button>
      </Col>
    </Row>

    <!--列表数据模块-->
    <Table class="app-table" :columns="teacherColumns" :data="teacherData.data" border></Table>
    <app-pager :data="teacherData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>
  </div>
</template>

<script>
/**
 * 排课管理 - 教师排课
 * @author chenliangshan
 * @version 2017-06-26
 */

import { createButton } from '@/utils'
import { list } from '@/mixins'

export default {
  name: 'app-curriculum-teachercurricula',
  mixins: [list],
  data() {
    return {
      // 搜索字段
      likeKeys: [
        { label: '教师名称', value: 'teacher_name' },
        { label: '员工编号', value: 'number' },
        { label: '授课科目', value: 'subject_type' },
      ],
      likeKey: 'teacher_name',  // 默认模糊字段
      // 教师字段
      teacherColumns: [
        { title: '教师姓名', key: 'teacher_name', align: 'center' },
        { title: '员工编号', key: 'user_number', align: 'center' },
        { title: '岗位性质', key: 'users_job_type', align: 'center' },
        {
          title: '授课年级',
          align: 'center',
          render: (h, params) => h('app-dicts-filter', { props: { value: params.row.grade, name: 'grade' } }) },
        { title: '授课科目', key: 'subject_type', align: 'center' },
        { title: '学生数', key: 'student_total', align: 'center' },
        { title: '未上课时', key: 'course_remain', align: 'center' },
        { title: '已完成课时', key: 'course_finish', align: 'center' },
        {
          title: '操作',
          align: 'center',
          render: createButton([
            {
              icon: 'edit',
              type: 'primary',
              click: (params) => {
                this.$router.push(`/curriculum/teachercurricula/course/${params.id}`)
              },
              text: '排课管理',
            },
          ]),
        },
      ],
      // 教师数据
      teacherData: {},
      // 当前查看的教师
      currentClbum: {},
    }
  },
  methods: {
    // 获取学员数据
    getData(qs) {
      return this.$http.get(`/teachercurricula${qs}`)
        .then((data) => {
          this.teacherData = data
        })
    },
  },
}
</script>

<style lang="less" scoped>
  .modal-header {
    span {
      padding-right: 10px;
    }
  }
</style>
