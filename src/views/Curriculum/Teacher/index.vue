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
      <Col>
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

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import { list } from '@/mixins'

export default {
  name: 'app-curriculum-teachercurricula',
  mixins: [list],
  data() {
    return {
      // 搜索字段
      form: {
        keyword: '',
      },
      // 教师字段
      teacherColumns: [
        { title: '教师姓名', key: 'username', align: 'center' },
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
    getData() {
      this.$http.get(`/teachercurricula${this.qs}`)
        .then((data) => {
          this.$store.commit(GLOBAL.LOADING.HIDE)
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
