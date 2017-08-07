<template>
  <app-form-modal v-model="courseModal"
                  :title="title"
                  :closable="false"
                  :loading="formLoading"
                  :width="800"
                  :ok-value="okValue"
                  @on-ok="beforeSubmit"
                  @on-cancel="formCancel('form')">
    <Form ref="form" :model="formData" :rules="ruleValidate" :label-width="formData.schedule_status !== 2 ? 90 : 110">
      <app-form-alert :errors="formErrors" :fullWidth="true"></app-form-alert>
      <Row>
        <Col span="8">
        <Form-item label="班级名称：">
          {{courseOption.class_name}}
        </Form-item>
        </Col>
        <Col span="8">
        <Form-item label="产品名称：">
          {{courseOption.product_name}}
        </Form-item>
        </Col>
        <Col span="8">
        <Form-item label="班主任：">{{courseOption.headmaster}}</Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <Form-item label="教师名称：" prop="teacher_id">
          <Select v-model="formData.teacher_id" placeholder="请选择" :disabled="status === 'finish'">
            <Option v-for="list in courseOption.teacher_optional" :value="list.teacher_id" :key="list.teacher_id">{{list.display_name}}</Option>
          </Select>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="选择课时：" prop="plan_course_id">
          <Select v-model="formData.plan_course_id" placeholder="请选择" :disabled="status === 'finish'">
            <Option v-for="list in courseOptional" :value="list.plan_course_id" :key="list.plan_course_id">{{list.display_name}}</Option>
          </Select>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <Form-item label="上课日期：" prop="date">
          <app-date-picker placeholder="选择日期" v-model="formData.date" :disabled="status === 'finish'"></app-date-picker>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="上课时段：" required>
          <Row>
            <Col span="11">
            <Form-item prop="start_at">
              <app-time-picker placeholder="开始时间" v-model="formData.start_at" :disabled="status === 'finish'" ref="start_at" format="HH:mm"></app-time-picker>
            </Form-item>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
            <Form-item prop="end_at">
              <app-time-picker placeholder="结束时间" v-model="formData.end_at" :disabled="status === 'finish'" format="HH:mm"></app-time-picker>
            </Form-item>
            </Col>
          </Row>
        </Form-item>
        </Col>
      </Row>
      <template v-if="status === 'finish'">
        <Row type="flex" justify="end">
          <Col>
          <Form-item label="实际上课课时：" prop="fact_cost">
            <Input type="text" placeholder="请填写实际上课课时" v-model="formData.fact_cost"></Input>
          </Form-item>
          </Col>
        </Row>
      </template>
      <Table class="app-table" :columns="studentColumns" :data="courseOption.student_optional" border></Table>
      </Form>
  </app-form-modal>
</template>

<script>
  /**
   * 班级排课管理-添加|编辑
   * @author     chenliangshan
   * @version    2017/07/18
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
      // 添加|编辑ID
      id: {
        type: Number,
        required: true,
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
          getData: '',
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
          plan_course_id: [
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
            this.$rules.date('请选择开始时间', {
              refs: this.$refs,
              min_ref: 'start_at',
              min_required: true,
            }),
            this.$rules.date('请选择大于开始时间', {
              refs: this.$refs,
              min_ref: 'start_at',
              is_equal: false,
            }),
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
          { title: '学员姓名', key: 'display_name', align: 'center' },
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
        formData: {
          product_id: null,
          teacher_id: null,
          plan_course_id: null,
          date: null,
          start_at: null,
          end_at: null,
          class_id: parseInt(this.$route.params.id, 10),
        },
      }
    },
    computed: {
      okValue() {
        let statusTxt = '确认'
        const txt = '编辑学员排课'
        switch (this.status) {
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
      courseOptional() {
        return this.courseOption.course_optional ? this.courseOption.course_optional[0] : []
      },
    },
    watch: {
      value(val) {
        this.courseModal = val
        if (val === true) {
          this.getCourseOption()
        }
      },
      courseModal(val) {
        if (val === false) {
          this.$emit('input', val)
        }
      },
    },
    methods: {
      // 获取上课参加情况 || 上课计算课时情况
      getJoinDeductVal(data) {
        if (data && data.length) {
          this.studentRadioJoin.attendance =
            data.map(({ student_id, is_attend, is_valid }) => ({
              student_id,
              is_attend,
              is_valid,
            }))
        }
      },
      // 获取备选数据
      getCourseOption() {
        this.$http.get(this.urlConf.getData)
          .then((result) => {
            if (this.status !== 'add') {
              // 编辑
              const info = [result.info]
                .map(({ attendance, ...item }) => ({ ...item }))[0]
              this.courseOption = result.optional
              this.formData = { ...this.formData, ...info }
              this.studentRadioJoin.attendance = result.info.attendance
            } else {
              // 新增
              const info = [result]
                .map(({ course_optional, student_optional, teacher_optional, ...item }) =>
                  ({ ...item }))[0]
              this.formReset = true
              this.courseOption = result
              this.formData = { ...this.formData, ...info }
              this.courseOption.student_optional =
                this.courseOption.student_optional.map(list =>
                  Object.assign({}, list, { student_id: list.id, is_attend: 1, is_valid: 1 }))
              this.getJoinDeductVal(this.courseOption.student_optional)
            }
          })
      },
      // 保存|添加课表
      submit() {
        let url = `${this.urlConf.edit}`
        let httpType = 'post'
        let msg = '成功添加课表'
        switch (this.status) {
          case 'add':
            break
          case 'edit':
            httpType = 'patch'
            msg = '成功更新课表'
            break
          case 'finish':
            url = `${this.urlConf.finish}`
            msg = '课时提交成功'
            break
          default:
        }
        // 数据交互
        const httpSetData = () => {
          this.$http[httpType](`${url}${this.id}`, { ...this.formData, ...this.studentRadioJoin })
            .then(() => {
              const self = this
              this.formLoading = false
              this.$Message.success({
                content: msg,
                onClose() {
                  self.courseModal = false
                  self.formCancel('form')
                  self.$emit('on-close')
                },
              })
            })
            .catch(error => this.errorHandler(error))
        }
        if (this.status === 'finish') {
          // 完成上课填写课时
          this.$Modal.confirm({
            title: '提示',
            content: '确认填写课时并完成该课表？',
            onOk: () => {
              httpSetData()
            },
          })
        } else {
          httpSetData()
        }
      },
      // 关闭弹窗
      formCancel(name) {
        this.formErrors = {}
        this.$refs[name].resetFields()
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
