<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item prop="startTime">
        <Date-picker type="date" v-model="form.startTime" placeholder="开始时间"></Date-picker>
      </Form-item>
      <Form-item prop="endTime">
        <Date-picker type="date" v-model="form.endTime" placeholder="结束时间"></Date-picker>
      </Form-item>
      <Form-item prop="keyword">
        <Input v-model="form.keyword" placeholder="请输入关键词"></Input>
      </Form-item>
      <Form-item>
        <Select v-model="form.subject">
          <Option value="1">全部</Option>
          <Option value="2">英语</Option>
          <Option value="3">数字</Option>
          <Option value="4">语文</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Select v-model="form.status">
          <Option value="1">全部</Option>
          <Option value="2">待确认</Option>
          <Option value="3">已排定</Option>
          <Option value="4">已取消</Option>
          <Option value="5">已上课</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <!--列表工具模块-->
    <Row class="app-content-header" type="flex" justify="end">
      <Col>
      <Button type="primary" @click="openCourseModal('add')">添加课表</Button>
      <Button type="primary">打印</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="dailyColumns" :data="dailyData.data" border></Table>
    <app-pager :data="dailyData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--添加|编辑|填写课时-课表弹窗-->
    <course-modal v-model="courseModal"
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
    name: 'app-class-course',
    mixins: [list],
    components: { WeeklyTable, CourseModal },
    data() {
      return {
        formLoading: false,
        // 课表弹窗-初始化
        courseModal: false,
        courseModalId: this.$route.params.id,
        courseModalParam: {
          id: parseInt(this.$route.params.id, 10),
        },
        // 弹窗数据
        formItem: {},
        // 弹窗表单校验
        ruleValidate: {
          teacher_id: [
            this.$rules.required('教师名称', 'number', 'change'),
          ],
          subject_type: [
            this.$rules.required('上课科目', 'number', 'change'),
          ],
          grade: [
            this.$rules.required('上课年级', 'number', 'change'),
          ],
          product_id: [
            this.$rules.required('产品名称', 'number', 'change'),
          ],
          course_cost: [
            this.$rules.required('课时', 'number', 'change'),
          ],
          date: [
            { required: true, type: 'date', message: '请选择日期', trigger: 'change' },
          ],
          start_at: [
            { required: true, type: 'date', message: '请选择时间', trigger: 'change' },
          ],
          end_at: [
            { required: true, type: 'date', message: '请选择时间', trigger: 'change' },
          ],
        },
        // 当前标签
        currentTab: {
          id: '1',
        },
        // 搜索字段
        form: {
//        startTime: '',
//        endTime: '',
//        keyword: '',
//        subject: '',
//        status: '',
        },
        // 日课表字段
        dailyColumns: [
          { title: '班级名称',
            align: 'center',
            render: (h, params) => h('span', params.row.model_info.display_name) },
          { title: '学员人数（个）',
            align: 'center',
            width: 80,
            render: (h, params) => h('span', params.row.model_info.student_total) },
          { title: '教师姓名', key: 'teacher_name', align: 'center', width: 100 },
          { title: '上课日期', key: 'date', align: 'center', width: 100 },
          { title: '上课时段',
            align: 'center',
            width: 125,
            render: (h, params) => h('span', `${params.row.start_at}-${params.row.end_at}`) },
          { title: '计划课时', key: 'course_cost', align: 'center', width: 80 },
          { title: '实际课时', key: 'fact_cost', align: 'center', width: 80 },
          { title: '上课科目', key: 'subject_type', align: 'center' },
          {
            title: '上课年级',
            align: 'center',
            render: (h, params) => h('app-dicts-filter', { props: { value: params.row.grade, name: 'grade' } }),
          },
          { title: '产品名称', key: 'product_name', align: 'center' },
          { title: '知识点', key: 'language_points', align: 'center' },
          { title: '课时状态',
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
          edit: '/classcurricula/',
          finish: '/classcurricula/finish/',
        },
      }
    },
    methods: {
      /**
       * 获取班级日课表数据
       * @param pageData  分页信息
       */
      getData(qs) {
        this.$http.get(`${this.urlConf.edit}${this.$route.params.id}${qs}`)
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
            this.$Message.info('点击了确定')
            this.$http.post(`/classcurricula/cancel/${row.id}`)
              .then((result) => {
                window.console.log(result)
              })
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .student-modal-content {
    width: 300px;
    margin: 0 auto;
  }
</style>
