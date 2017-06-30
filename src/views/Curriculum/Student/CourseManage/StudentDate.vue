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
          <Option value="">全部</Option>
          <Option value="0">待确认</Option>
          <Option value="1">已排定</Option>
          <Option value="2">已上课</Option>
          <Option value="3">已取消</Option>
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

    <!--添加课表弹窗-->
    <app-form-modal v-model="courseModal"
                    title="学员排课"
                    :closable="false"
                    :loading="formLoading"
                    :width="500"
                    @on-ok="beforeSubmit"
                    @on-cancel="formCancel('form')">
      <div class="student-modal-content">
        <Form ref="form" :model="formItem" :rules="ruleValidate" :label-width="90">
          <Form-item label="教师名称：" prop="teacher_id">
            <Select v-model="formItem.teacher_id" placeholder="请选择">
              <Option v-for="list in courseOption.teacher_id" :value="list.value" :key="list.value">{{list.display_name}}</Option>
            </Select>
          </Form-item>
          <Form-item label="上课科目：" prop="subject_type">
            <Select v-model="formItem.subject_type" placeholder="请选择">
              <Option v-for="list in courseOption.subject_type" :value="list.value" :key="list.value">{{list.display_name}}</Option>
            </Select>
          </Form-item>
          <Form-item label="上课年级：" prop="grade">
            <Select v-model="formItem.grade" placeholder="请选择">
              <Option v-for="list in courseOption.grade" :value="list.value" :key="list.value">{{list.display_name}}</Option>
            </Select>
          </Form-item>
          <Form-item label="产品名称：" prop="product_id">
            <Select v-model="formItem.product_id" placeholder="请选择">
              <Option v-for="list in courseOption.product_id" :value="list.value" :key="list.value">{{list.display_name}}</Option>
            </Select>
          </Form-item>
          <Form-item label="选择课时：" prop="course_cost">
            <Select v-model="formItem.course_cost" placeholder="请选择">
              <Option v-for="list in courseOption.course_cost" :value="list.value" :key="list.value">{{list.display_name}}</Option>
            </Select>
          </Form-item>
          <Form-item label="上课日期：" prop="date">
            <Date-picker placeholder="选择日期" v-model="formItem.date"></Date-picker>
          </Form-item>
          <Form-item label="上课时段：" required>
            <Row>
              <Col span="11">
              <Form-item prop="start_at">
                <Time-picker placeholder="选择开始时间" v-model="formItem.start_at" format="HH:mm"></Time-picker>
              </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
              <Form-item prop="end_at">
                <Time-picker placeholder="选择结束时间" v-model="formItem.end_at" format="HH:mm"></Time-picker>
              </Form-item>
              </Col>
            </Row>
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
import { form, list } from '@/mixins'
import WeeklyTable from '../../Components/WeeklyTable'

export default{
  name: 'app-student-course-manage',
  mixins: [form, list],
  components: { WeeklyTable },
  data() {
    return {
      formLoading: false,
      // 课表弹窗-初始化
      courseModal: false,
      courseModalParam: {
        id: this.$route.params.id,
      },
      // 弹窗数据
      formItem: {
        teacher_id: null,
        subject_type: null,
        grade: null,
        product_id: null,
        course_cost: null,
        date: null,
        start_at: null,
        end_at: null,
      },
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
        { title: '学员姓名',
          align: 'center',
          width: 120,
          render: (h, params) => h('span', {}, `${params.row.model_info.display_name}`),
        },
        { title: '教师姓名', key: 'teacher_name', align: 'center', width: 120 },
        { title: '上课日期', key: 'date', align: 'center', width: 90 },
        { title: '上课时段',
          align: 'center',
          width: 110,
          render: (h, params) => h('span', {}, `${params.row.start_at}-${params.row.end_at}`),
        },
        { title: '计划课时', key: 'course_cost', align: 'center', width: 80 },
        { title: '实际课时', key: 'fact_cost', align: 'center', width: 80 },
        { title: '上课科目', key: 'subject_type', align: 'center' },
        { title: '上课年级', key: 'grade', align: 'center' },
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
            } else if (status === 2 && factCost) {
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
                      self.openCourseModal('edit', params.row)
                    },
                  },
                }, '填写课时'),
              ])
            }
            // 完成上课且填写课时
            return h('div', [
              h('span', {
                class: 'color-primary',
              }, '完成上课'),
            ])
          },
        },
      ],
      // 日课表数据
      dailyData: {},
      // 备选数据
      courseOption: {},
    }
  },
  methods: {
    // 获取备选数据
    getCourseOption() {
      this.$http.get(`/courseoption/${this.$route.params.id}`)
        .then((result) => {
          this.courseOption = result.option
        })
    },
    // 获取学员日课表数据
    getData() {
      this.getCourseOption()
      this.$http.get(`/studentcurricula/${this.$route.params.id}${this.qs}`)
        .then((data) => {
          this.$store.commit(GLOBAL.LOADING.HIDE)
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
      this.courseModalParam.id = id
      this.courseModal = true
    },
    // 保存|添加课表
    submit() {
      this.$http.post(`/studentcurricula/${this.courseModalParam.id}`, this.formItem)
        .then((result) => {
          this.formLoading = false
          window.console.log(result)
        })
        .catch(this.errorHandler)
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
    // 关闭弹窗
    formCancel(name) {
      this.$refs[name].resetFields()
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
