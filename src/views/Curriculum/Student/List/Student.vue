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
      <Button type="primary" @click="$router.push('/curriculum/student/timetable/2')">打印</Button>
      </Col>
    </Row>

    <!--列表数据模块-->
    <Table class="app-table" :columns="studentColumns" :data="studentData.data" border></Table>
    <app-pager :data="studentData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>
  </div>
</template>

<script>
  /**
   * 学员排课
   * @author    chenliangshan
   * @addTime   2017/06/28
   */
import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import { list } from '@/mixins'

  export default {
    name: 'app-curriculum-student-list',
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
          {
            title: '当前年级',
            align: 'center',
            render: (h, params) => h('app-dicts-filter', { props: { value: params.row.current_grade, name: 'grade' } }) },
          { title: '班主任', key: 'belong_customer_relationships', align: 'center' },
          { title: '学管师', key: 'belong_customer_relationships', align: 'center' },
          { title: '产品名称', key: 'schedule_product_name', align: 'center' },
          { title: '上课课时', key: 'course_total', align: 'center' },
          {
            title: '操作',
            align: 'center',
            render: createButton([
              {
                icon: 'edit',
                type: 'primary',
                click: (params) => {
                  this.$router.push(`/curriculum/student/course/${params.id}`)
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
      getStudentData() {
        this.$http.get(`/studentcurricula${this.qs}`)
          .then((data) => {
            this.$store.commit(GLOBAL.LOADING.HIDE)
            this.studentData = data
          })
      },
      // 根据当前页码或每页条数获取数据
      getData() {
        this.getStudentData()
      },
    },
  }
</script>

<style lang="less">

</style>
