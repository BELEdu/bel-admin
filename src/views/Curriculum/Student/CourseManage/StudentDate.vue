<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Date-picker v-model="query.between.created_at" type="daterange" placeholder="请选择时间期间"></Date-picker>
      </Form-item>
      <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键词">
          <Select v-model="likeKey" slot="prepend" style="width:6em">
            <Option v-for="likeKey in likeKeys"
                    :key="likeKey.value"
                    :value="likeKey.value">{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Select v-model="query.equal.subject_id">
          <Option value="">全部</Option>
          <Option v-for="list in subjectType"
                  :key="list.value"
                  :value="list.value">{{list.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Select v-model="query.equal.schedule_status">
          <Option value="">全部</Option>
          <Option value="0">待确认</Option>
          <Option value="1">已排定</Option>
          <Option value="2">已上课</Option>
          <Option value="3">已取消</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <!--列表工具模块-->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2><Icon type="ios-calendar" /> 学员日课表</h2>
      </Col>
      <Col>
      <Button type="primary" @click="openCourseModal('add')">添加课表</Button>
      <Button type="primary">打印</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="dailyColumns" :data="dailyData.data" @on-sort-change="sort" border></Table>
    <app-pager :data="dailyData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--添加|编辑|填写课时-课表弹窗-->
    <course-modal v-model="courseModal"
                  title="学员排课"
                  :data="formItem"
                  :id="courseModalParam.id"
                  :status="courseModalParam.status"
                  :urlConf="urlConf"
                  @on-close="updateData"></course-modal>
  </div>
</template>

<script>
/**
 * 学员排课表
 * @author  chenliangshan
 * @update    2017/06/28
 */

import { list } from '@/mixins'
import WeeklyTable from '../../Components/WeeklyTable'
import CourseModal from '../../Components/CourseModal'

export default{
  name: 'app-student-course',
  mixins: [list],
  components: { WeeklyTable, CourseModal },
  data() {
    return {
      // 搜索字段
      query: {
        between: {
          created_at: [],
        },
        equal: {
          schedule_status: '',
        },
      },
      likeKeys: [
        { label: '教师姓名', value: 'teacher_name' },
        { label: '教学对象', value: 'display_name' },
        { label: '学管师', value: 'belong_customer_relationships' },
      ],
      likeKey: 'teacher_name',
      subjectType: [
        { display_name: '语文', value: 1 },
        { display_name: '数学', value: 2 },
        { display_name: '英语', value: 3 },
      ],
      formLoading: false,
      // 课表弹窗-初始化
      courseModal: false,
      courseModalParam: {
        id: parseInt(this.$route.params.id, 10),
      },
      // 弹窗数据
      formItem: {},
      // 日课表字段
      dailyColumns: [
        { title: '学员姓名',
          align: 'center',
          width: 120,
          render: (h, params) => h('span', {}, `${params.row.model_info.display_name}`),
        },
        { title: '教师姓名', key: 'teacher_name', align: 'center', width: 120 },
        { title: '上课日期', key: 'date', align: 'center', width: 90, sortable: 'custom' },
        { title: '上课时段',
          align: 'center',
          width: 125,
          render: (h, params) => h('span', {}, `${params.row.start_at}-${params.row.end_at}`),
        },
        { title: '计划课时', key: 'course_cost', align: 'center', width: 90, sortable: 'custom' },
        { title: '实际课时', key: 'fact_cost', align: 'center', width: 90, sortable: 'custom' },
        { title: '上课科目', key: 'subject_type', align: 'center' },
        { title: '产品名称', key: 'product_name', align: 'center' },
        { title: '知识点', key: 'language_points', align: 'center' },
        { title: '课表状态',
          align: 'center',
          width: 80,
          render: (h, params) => h('app-dicts-filter', { props: { value: params.row.schedule_status } }),
        },
        {
          title: '操作',
          align: 'center',
          width: 110,
          render: (h, params) => {
            const self = this
            const status = params.row.schedule_status
            const factCost = params.row.fact_cost
            if (status === 0 || status === 1) {
              return h('div', [
                h('Button', {
                  class: 'color-primary',
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  on: {
                    click() {
                      // 编辑
                      self.openCourseModal('edit', params.row)
                    },
                  },
                }, '编辑'),
                h('Button', {
                  class: 'color-error',
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  on: {
                    click() {
                      // 取消
                      self.cancelCurriculum(params.row)
                    },
                  },
                }, '取消'),
              ])
            } else if (status === 3) {
              // 已取消
              return h('div', [
                h('span', {
                  class: 'color-cancel',
                }, '已取消'),
              ])
            } else if (status === 2 && !factCost) {
              // 完成上课-未填写课时
              return h('div', [
                h('Button', {
                  class: 'color-primary',
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  on: {
                    click() {
                      self.openCourseModal('finish', params.row)
                    },
                  },
                }, '填写课时'),
              ])
            }
            // 完成上课且填写课时
            return h('div', [
              h('span', {
                class: 'color-success ',
              }, '完成上课'),
            ])
          },
        },
      ],
      // 日课表数据
      dailyData: {},
      // 请求接口
      urlConf: {
        option: '/courseoption/',
        edit: '/studentcurricula/',
        finish: '/studentcurricula/finish/',
      },
    }
  },
  methods: {
    // 获取学员日课表数据
    getData(qs) {
      return this.$http.get(`${this.urlConf.edit}${this.$route.params.id}${qs}`)
        .then((data) => {
          this.dailyData = data
        })
    },
    // 打开编辑|添加课表弹窗
    openCourseModal(type, item = {}) {
      let id = this.$route.params.id
      switch (type) {
        case 'add':
          break
        default :
          id = item.id
          this.formItem = { ...this.formItem, ...item }
          break
      }
      this.courseModalParam.status = type
      this.courseModalParam.id = parseInt(id, 10)
      this.courseModal = true
    },
    // 取消排课
    cancelCurriculum(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否确认取消该排课？',
        onOk: () => {
          this.$http.post(`/studentcurricula/cancel/${row.id}`)
            .then((result) => {
              window.console.log(result)
            })
        },
      })
    },
  },
}
</script>

