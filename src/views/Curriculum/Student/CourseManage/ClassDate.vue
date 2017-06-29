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
    <app-pager :data="dailyData" @on-change="getPageData" @on-page-size-change="getPerPageData"></app-pager>

    <!--添加课表弹窗-->
    <app-form-modal v-model="courseModal"
                    title="学员排课"
                    :closable="false"
                    :loading="false"
                    :width="500">
      <div class="student-modal-content">
        <Form :model="formItem" :label-width="80">
          <Form-item label="教师名称：">
            <Select v-model="formItem.teacher_name" placeholder="请选择">
              <Option value="1">张三</Option>
              <Option value="2">李四</Option>
            </Select>
          </Form-item>
          <Form-item label="上课科目：">
            <Select v-model="formItem.subjects_class" placeholder="请选择">
              <Option value="1">语文</Option>

              <Option value="2">数学</Option>
            </Select>
          </Form-item>
          <Form-item label="上课年级：">
            <Select v-model="formItem.grade_class" placeholder="请选择">
              <Option value="1">七年级</Option>
              <Option value="2">八年级</Option>
            </Select>
          </Form-item>
          <Form-item label="产品名称：">
            <Select v-model="formItem.product_name" placeholder="请选择">
              <Option value="1">奥数提高</Option>
              <Option value="2">冲刺</Option>
            </Select>
          </Form-item>
          <Form-item label="选择课时：">
            <Select v-model="formItem.plan_class" placeholder="请选择">
              <Option value="1">第1节</Option>
              <Option value="2">第2节</Option>
            </Select>
          </Form-item>
          <Form-item label="上课日期：">
            <Date-picker type="date" placeholder="选择日期" v-model="formItem.class_date"></Date-picker>
          </Form-item>
          <Form-item label="上课时段：">
            <Time-picker confirm type="timerange" placement="bottom-end" placeholder="选择时间" style="width: 168px" v-model="formItem.class_time"></Time-picker>
          </Form-item>
          <Form-item label="学馆师：">{{formItem.customer_teacher}}</Form-item>
        </Form>
      </div>
    </app-form-modal>
  </div>
</template>

<script>
  /**
   * 学员排课表
   * @author  chenliangshan
   * @update    2017/06/28
   */

  import { GLOBAL } from '@/store/mutationTypes'
  import { list } from '@/mixins'
  import WeeklyTable from '../../Components/WeeklyTable'

  export default{
    name: 'app-student-course-manage',
    mixins: [list],
    components: { WeeklyTable },
    data() {
      return {
        // 课表弹窗-初始化
        courseModal: false,
        courseModalId: this.$route.params.id,
        // 弹窗数据
        formItem: {},
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
            width: 100,
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
              if (params.row) {
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
                        self.openCourseModal(params.row)
                      },
                    },
                  }, '编辑'),
                  h('Button', {
                    class: 'color-cancel',
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
              }
              // 完成上课
              return h('div', [
                h('Button', {
                  class: 'table-btn color-primary',
                  props: {
                    icon: 'thumbsup',
                    type: 'text',
                    size: 'small',
                  },
                  on: {
                    click() {
                      // 回调
                    },
                  },
                }),
              ])
            },
          },
        ],
        // 日课表数据
        dailyData: {},
      }
    },
    methods: {
      /**
       * 获取班级日课表数据
       * @param pageData  分页信息
       */
      getData() {
        this.$http.get(`/classcurricula/${this.$route.params.id}${this.qs}`)
          .then((data) => {
            this.$store.commit(GLOBAL.LOADING.HIDE)
            this.dailyData = data
          })
      },
      // 打开编辑|添加课表弹窗
      openCourseModal(type, item = {}) {
        switch (type) {
          case 'add':
            this.courseModalId = this.$route.params.id
            break
          default :
            this.courseModalId = item.id
            break
        }
        this.formItem = item
        this.courseModal = true
      },
      // 保存|添加课表
      addCourse() {
        this.$http.post(`/classcurricula/${this.courseModalId}`, this.formItem)
          .then((result) => {
            window.console.log(result)
          })
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
