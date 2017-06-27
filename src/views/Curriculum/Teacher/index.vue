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
    <app-pager :data="teacherData" @on-change="getPageInfo" @on-page-size-change="getPerPageInfo"></app-pager>
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

export default {
  name: 'app-curriculum-teachercurricula',
  mounted() {
    this.getTeacherData(this.pager.defaultPage)
  },
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
        { title: '学科组', key: 'company_id', align: 'center' },
        { title: '岗位性质', key: 'users_job_type', align: 'center' },
        { title: '授课年级', key: 'grade', align: 'center' },
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
                this.$router.push(`/curriculum/teachercurricula/edit/${params.id}`)
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
      // 分页数据
      pager: {
        // 默认分页数据
        defaultPage: {
          page: 1,
          per_page: 10,
        },
        // 教师分页数据
        teacher: {},
      },
    }
  },
  methods: {
    // 获取学员数据
    getTeacherData(pageData = this.pager.teacher) {
      this.pager.teacher = pageData
      this.$http.get(`/teachercurricula?page=${pageData.page}&per_page=${pageData.per_page}`)
        .then((data) => {
          this.$store.commit(GLOBAL.LOADING.HIDE)
          this.teacherData = data
        })
    },
    // 根据页码获取数据
    getPageInfo(pageId = 1) {
      this.pager.teacher = Object.assign({}, this.pager.defaultPage, { page: pageId })
      this.getTeacherData(this.pager.teacher)
    },
    // 根据每页条数获取数据
    getPerPageInfo(perPageId = 10) {
      this.pager.teacher = Object.assign({}, this.pager.defaultPage, { per_page: perPageId })
      this.getTeacherData(this.pager.teacher)
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
