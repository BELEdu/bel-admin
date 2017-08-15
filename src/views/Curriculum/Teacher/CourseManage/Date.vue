<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Date-picker v-model="query['between[created_at]']" type="daterange" placeholder="请选择时间期间"></Date-picker>
      </Form-item>
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键词">
        <Select v-model="likeKey" slot="prepend" style="width:6em">
          <Option v-for="likeKey in likeKeys"
                  :key="likeKey.value"
                  :value="likeKey.value">{{ likeKey.label }}</Option>
        </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Select v-model="query['equal[subject_id]']">
          <Option value="">全部</Option>
          <Option v-for="list in subjectType"
                  :key="list.value"
                  :value="list.value">{{list.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Select v-model="query['equal[schedule_status]']">
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
      <h2><Icon type="ios-calendar" /> 日课表</h2>
      </Col>
      <Col>
      <Button type="primary" @click="$router.push('/curriculum/student/timetable/2')">打印</Button>
      </Col>
    </Row>
    <Table class="app-table" :columns="dailyColumns" :data="dailyData.data" @on-sort-change="sort" border></Table>
    <app-pager :data="dailyData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--查看||编辑课表弹窗-->
    <teacher-course-modal v-model="courseModal"
                          :config="courseModalParam"
                          :errors="formErrors"
                          @on-submit="submit"
                          @on-cancel="courseModalCancel"></teacher-course-modal>
  </div>
</template>

<script>
  /**
   * 教师排课-日课表
   * @author    chenliangshan
   * @version   2017/07/01
   */

  import { list } from '@/mixins'
  import TeacherCourseModal from '../../Components/TeacherCourseModal'

  const server_msg = '服务端错误，请联系网站管理员或稍后重试'

  export default{
    name: 'app-teacher-course-date',
    mixins: [list],
    components: { TeacherCourseModal },
    data() {
      return {
        // 搜索字段
        query: {
          'between[created_at]': [],
          'equal[schedule_status]': [],
        },
        likeKeys: [
          { label: '教师姓名', value: 'teacher_name' },
          { label: '教学对象', value: 'display_name' },
          { label: '学管师', value: 'counsellor_name' },
        ],
        likeKey: 'teacher_name',
        subjectType: [
          { display_name: '语文', value: 1 },
          { display_name: '数学', value: 2 },
          { display_name: '英语', value: 3 },
        ],
        // 课表弹窗-初始化
        courseModal: false,
        courseModalParam: {
          okValue: '确认上课',
          okBtn: true,
          cancelValue: '取消',
        },
        knowledgeModal: false,
        knowledgeData: [{
          id: 1,
          name: '平等分',
        }, {
          id: 2,
          name: '平等分2',
        }],
        formErrors: {},
        // 日课表字段
        dailyColumns: [
          { title: '教师姓名', key: 'teacher_name', align: 'center' },
          { title: '教学对象', key: 'instance_name', align: 'center', width: 110 },
          { title: '上课日期', key: 'date', align: 'center', width: 100, sortable: 'custom' },
          { title: '上课时段',
            align: 'center',
            width: 110,
            render: (h, params) => h('span', {}, `${params.row.start_at}-${params.row.end_at}`),
          },
          { title: '计划课时', key: 'course_cost', align: 'center', width: 110, sortable: 'custom' },
          { title: '实际课时', key: 'fact_cost', align: 'center', width: 90, sortable: 'custom' },
          { title: '上课科目', key: 'subject_item_name', align: 'center', width: 80 },
          { title: '产品名称', key: 'product_name', align: 'center' },
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
              }
              // 完成上课
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
      }
    },
    methods: {
      // 获取教师日课表数据
      getData(qs) {
        return this.$http.get(`/teachercurricula/${this.$route.params.id}${qs}`)
          .then((data) => {
            this.dailyData = data
          })
      },
      // 打开编辑|添加课表弹窗
      openCourseModal(type, item) {
        this.formErrors = {}
        this.courseModal = true
        this.courseModalParam = { ...this.courseModalParamid, item: { ...item } }
      },
      // 取消排课
      cancelCurriculum(item) {
        this.$Modal.confirm({
          title: '提示',
          content: '是否确认取消该排课？',
          onOk: () => {
            this.$http.post(`/teachercurricula/cancel/${item.id}`)
              .then(() => {
                this.$Message.success('该排课成功取消')
              })
              .catch((errors) => {
                this.$Notice.error({
                  desc: errors.message || server_msg,
                })
              })
          },
        })
      },
      // 取消编辑
      courseModalCancel() {},
      submit() {},
    },
  }
</script>
