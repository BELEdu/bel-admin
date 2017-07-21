<template>
  <app-form-modal v-model="courseModal"
                  :title="title"
                  :closable="false"
                  :loading="formLoading"
                  :width="500"
                  :ok-value="okValue"
                  @on-ok="beforeSubmit"
                  @on-cancel="formCancel('form')">
    <div class="course-modal-content">
      <Form ref="form" :model="formData" :rules="ruleValidate" :label-width="110">
        <app-form-alert :errors="formErrors" :fullWidth="true"></app-form-alert>
        <Form-item label="学员姓名：">
          {{courseOption.student_name}}
        </Form-item>
        <Form-item label="产品名称：" prop="product_id">
          <Select v-model="formData.product_id" placeholder="请选择" @on-change="productChange(formData.product_id)" :disabled="status === 'finish'">
            <Option v-for="list in courseOption.product_optional" :value="list.product_id" :label="list.display_name" :key="list.value">
            </Option>
          </Select>
        </Form-item>
        <Form-item label="教师名称：" prop="teacher_id">
          <Select v-model="formData.teacher_id" placeholder="请选择" :disabled="status === 'finish'">
            <Option v-for="list in courseOption.teacher_optional" :value="list.teacher_id" :key="list.teacher_id">{{list.display_name}}</Option>
          </Select>
        </Form-item>
        <Form-item label="选择课时：" prop="plan_course_id">
          <Select v-model="formData.plan_course_id" placeholder="请选择" :disabled="status === 'finish'" ref="planCourseId">
            <Option v-for="list in courseOptional" :value="list.plan_course_id" :key="list.plan_course_id">{{list.display_name}}</Option>
          </Select>
        </Form-item>
        <Form-item label="上课日期：" prop="date">
          <app-date-picker placeholder="选择日期" v-model="formData.date" :disabled="status === 'finish'"></app-date-picker>
        </Form-item>
        <Form-item label="上课时段：" required>
          <Row>
            <Col span="11">
            <Form-item prop="start_at">
              <app-time-picker placeholder="选择开始时间" v-model="formData.start_at" ref="start_at" format="HH:mm" :disabled="status === 'finish'"></app-time-picker>
            </Form-item>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
            <Form-item prop="end_at">
              <app-time-picker placeholder="选择结束时间" v-model="formData.end_at" format="HH:mm" :disabled="status === 'finish'"></app-time-picker>
            </Form-item>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="实际上课课时：" prop="fact_cost" v-if="formData.schedule_status === 2">
          <Input type="text" placeholder="请填写课时" v-model="formData.fact_cost"></Input>
        </Form-item>
        <Form-item label="学管师：">{{courseOption.counsellor_name}}</Form-item>
      </Form>
    </div>
  </app-form-modal>
</template>

<script>
  /**
   * 排课管理-添加|编辑
   * @author     chenliangshan
   * @version    2017/07/18
   */

  import { form } from '@/mixins'

  export default {
    name: 'course-modal',
    mixins: [form],
    props: {
      value: {
        type: Boolean,
        default: false,
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
              trigger: 'change',
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
        courseOptional: [],
        formReset: false,
        formData: {
          product_id: null,
          teacher_id: null,
          plan_course_id: null,
          date: null,
          start_at: null,
          end_at: null,
          student_id: parseInt(this.$route.params.id, 10),
        },
      }
    },
    computed: {
      okValue() {
        const status = this.formData.schedule_status
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
      // 获取备选数据
      getCourseOption() {
        this.$http.get(this.urlConf.getData)
        .then((result) => {
          if (this.status !== 'add') {
            // 编辑
            this.courseOption = result.optional
            this.formData = { ...this.formData, ...result.info }
          } else {
            // 新增
            this.formReset = true
            this.courseOption = result
          }
        })
      },
      // 产品联动课时
      productChange(id) {
        if (id) {
          const productPptional = this.courseOption.product_optional
          const idx = Object.keys(productPptional).map(k => productPptional[k])
            .filter(item => item.product_id === id)[0].subject_item
          this.courseOptional = this.courseOption.course_optional[idx]
          if (this.formReset) {
            this.$nextTick(() => {
              this.$refs.form.fields
                .filter(item => item.prop === 'plan_course_id')[0].resetField()
            })
          } else {
            this.formReset = true
          }
        }
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
        const attendance = [
          {
            // 学员id
            student_id: this.formData.student_id,
            // 是否上课
            is_attend: 1,
            // 是否扣课时
            is_valid: 1,
          },
        ]
        // 数据交互
        const httpSetData = () => {
          this.$http[httpType](`${url}${this.id}`, { ...this.formData, attendance })
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
      formCancel(name = 'form') {
        this.formErrors = {}
        this.courseOptional = []
        this.$refs[name].resetFields()
      },
    },
    watch: {
      value(val) {
        this.courseModal = val
        this.formReset = false
        if (val) {
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
