<template>
  <app-form-modal v-model="courseModal"
                  :title="title"
                  :closable="false"
                  :loading="formLoading"
                  :width="840"
                  :ok-value="okValue"
                  @on-ok="beforeSubmit"
                  @on-cancel="formCancel('form')">
    <Form ref="form" :model="data" :rules="ruleValidate" :label-width="data.schedule_status !== 2 ? 90 : 110">
      <template v-if="data.schedule_status !== 2">
        <Row>
          <Col span="8">
          <Form-item label="产品名称：">
            {{data.product_name}}
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="教师名称：" prop="teacher_id">
            <Select v-model="data.teacher_id" placeholder="请选择">
              <Option v-for="list in courseOption.teacher_id" :value="list.value" :key="list.value">{{list.display_name}}</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="学馆师：">{{data.customer_teacher}}</Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <Form-item label="选择课时：" prop="course_cost">
            <Select v-model="data.plan_course_id" placeholder="请选择">
              <Option v-for="list in courseOption.course_cost" :value="list.value" :key="list.value">{{list.display_name}}</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="上课日期：" prop="date">
            <app-date-picker placeholder="选择日期" v-model="data.date"></app-date-picker>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="上课时段：" required>
            <Row>
              <Col span="11">
              <Form-item prop="start_at">
                <app-time-picker placeholder="开始时间" v-model="data.start_at" format="HH:mm"></app-time-picker>
              </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
              <Form-item prop="end_at">
                <app-time-picker placeholder="结束时间" v-model="data.end_at" format="HH:mm"></app-time-picker>
              </Form-item>
              </Col>
            </Row>
          </Form-item>
          </Col>
        </Row>
      </template>
      <template v-else>
        <Row type="flex" justify="end">
          <Col>
          <Form-item label="实际上课课时：" prop="fact_cost">
            <Input type="text" placeholder="请填写实际上课课时" v-model="data.fact_cost"></Input>
          </Form-item>
          </Col>
        </Row>
      </template>
      <Table class="app-table" :columns="studentColumns" :data="studentData.data" border></Table>
      </Form>
  </app-form-modal>
</template>

<script>
  /**
   * 班级排课管理-添加|编辑
   * @author     chenliangshan
   * @version    2017/07/02
   */

  import { form } from '@/mixins'

  export default {
    name: 'class-course-modal',
    mixins: [form],
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      // 表单数据
      data: {
        type: Object,
        default: {},
      },
      // 添加|编辑ID
      id: {
        type: Number,
        default: null,
      },
      status: {
        type: String,
        default: 'add',
      },
      urlConf: {
        type: Object,
        default: {
          option: '/courseoption/',
          edit: '/studentcurricula/',
          finish: '/studentcurricula/finish/',
          info: '/curriculum/student/clbumInfo.json',
        },
      },
    },
    data() {
      return {
        title: '添加学员排课',
        courseOption: {},
        courseModal: false,
        ruleValidate: {
          teacher_id: [
            this.$rules.required('教师名称', 'number', 'change'),
          ],
          product_id: [
            this.$rules.required('产品名称', 'number', 'change'),
          ],
          course_cost: [
            this.$rules.required('课时', 'number', 'change'),
          ],
          date: [
            this.$rules.date('日期必填', {
              trigger: 'blur',
            }),
          ],
          start_at: [
            this.$rules.date('开始时间必填'),
          ],
          end_at: [
            this.$rules.date('结束时间必填'),
          ],
          fact_cost: [
            this.$rules.required('实际上课课时'),
            this.$rules.number,
            {
              validator(rule, value, callback) {
                const errors = []
                if (value < 1) {
                  errors.push(new Error('课时需大于等于1'))
                }
                callback(errors)
              },
            },
          ],
        },
        studentColumns: [
          {
            title: '序号',
            type: 'index',
            width: 50,
            align: 'center',
          },
          { title: '学员姓名',
            align: 'center',
            render: (h, params) => h('span', params.row.student_name) },
          { title: '上课日期', key: 'date', align: 'center', width: 100 },
          { title: '上课时段',
            align: 'center',
            width: 125,
            render: (h, params) => h('span', `${params.row.start_at}-${params.row.end_at}`) },
          { title: '签约课时', key: 'course_total', align: 'center', width: 90 },
          { title: '剩余课时', key: 'course_remain', align: 'center', width: 90 },
          { title: '是否上课',
            align: 'center',
            render: (h, params) => {
              const self = this
              return h('Radio-group', {
                props: {
                  value: self.studentRadioJoin.attendance[params.index].is_attend,
                },
                on: {
                  input(value) {
                    self.studentRadioJoin.attendance[params.index].is_attend = value
                  },
                },
              }, [
                h('Radio', {
                  props: {
                    label: 1,
                  },
                }, '是'),
                h('Radio', {
                  props: {
                    label: 0,
                  },
                }, '否'),
              ])
            },
          },
          {
            title: '是否计算课时',
            align: 'center',
            render: (h, params) => {
              const self = this
              return h('Radio-group', {
                props: {
                  value: self.studentRadioJoin.attendance[params.index].is_valid,
                },
                on: {
                  input(value) {
                    self.studentRadioJoin.attendance[params.index].is_valid = value
                  },
                },
              }, [
                h('Radio', {
                  props: {
                    label: 1,
                  },
                }, '是'),
                h('Radio', {
                  props: {
                    label: 0,
                  },
                }, '否'),
              ])
            },
          },
        ],
        studentData: {},
        studentRadioJoin: {
          attendance: [],
        },
      }
    },
    created() {
    },
    computed: {
      okValue() {
        const status = this.data.schedule_status
        let statusTxt = '确认'
        const txt = '编辑学员排课'
        switch (status) {
          case 0:
            this.title = txt
            break
          case 1:
            this.title = txt
            break
          case 2:
            statusTxt = '确认课时'
            this.title = '填写课时'
            break
          default:
            statusTxt = '确认'
            break
        }
        return statusTxt
      },
    },
    methods: {
      // 获取上课参加情况 || 上课计算课时情况
      getJoinDeductVal(data) {
        if (data && data.length) {
          const join = []
          data.map(item => join.push({
            student_id: item.student_id,
            is_attend: item.is_attend,
            is_valid: item.is_valid,
          }))
          this.studentRadioJoin.attendance = join
        }
      },
      // 班级学员数据
      getStudentInfo() {
        this.$http.get(`${this.urlConf.info}`)
          .then((result) => {
            this.studentData = result
            this.getJoinDeductVal(result.data)
          })
      },
      // 获取备选数据
      getCourseOption() {
        this.$http.get(`${this.urlConf.option}${this.$route.params.id}`)
          .then((result) => {
            this.courseOption = result.option
          })
      },
      // 保存|添加课表
      submit() {
        let url
        if (this.status === 'finish') {
          url = `${this.urlConf.finish}`
        } else {
          url = `${this.urlConf.edit}`
        }
        this.$http.post(`${url}${this.id}`, { ...this.data })
          .then((result) => {
            this.formLoading = false
            this.$emit('on-close')
            window.console.log(result)
          })
          .catch(error => this.errorHandler(error))
      },
      // 关闭弹窗
      formCancel(name) {
        this.formErrors = {}
        this.$refs[name].resetFields()
      },
    },
    watch: {
      value(val) {
        this.courseModal = val
        if (val === true) {
          this.getStudentInfo()
          this.getCourseOption()
        }
      },
      courseModal(val) {
        if (val === false) {
          this.$emit('input', val)
        }
      },
    },
  }
</script>

<style lang="less">
  .course-modal-content {
    width: 360px;
    margin: 0 auto;
    .course-select {
      .ivu-select-item {
        padding: 0;
      }
      .ivu-tooltip {
        &, .ivu-tooltip-rel {
          display: block;
        }
        .ivu-tooltip-rel {
          padding: 7px 16px;
        }
      }
    }
  }

</style>
