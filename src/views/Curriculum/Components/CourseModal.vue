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
      <Form ref="form" :model="data" :rules="ruleValidate" :label-width="110">
        <app-form-alert :errors="formErrors"></app-form-alert>
        <Form-item label="教师名称：" prop="teacher_id">
          <Select v-model="data.teacher_id" placeholder="请选择" :disabled="status === 'finish'">
            <Option v-for="list in courseOption.teacher_id" :value="list.value" :key="list.value">{{list.display_name}}</Option>
          </Select>
        </Form-item>
        <Form-item label="上课科目：" prop="subject_type">
          <Select v-model="data.subject_type" placeholder="请选择" :disabled="status === 'finish'">
            <Option v-for="list in courseOption.subject_type" :value="list.value" :key="list.value">{{list.display_name}}</Option>
          </Select>
        </Form-item>
        <Form-item label="上课年级：" prop="grade">
          <Select v-model="data.grade" placeholder="请选择" :disabled="status === 'finish'">
            <Option v-for="list in courseOption.grade" :value="list.value" :key="list.value">{{list.display_name}}</Option>
          </Select>
        </Form-item>
        <Form-item label="产品名称：" prop="product_id">
          <div class="course-select">
            <Select v-model="data.product_id" placeholder="请选择" :disabled="status === 'finish'">
              <Option v-for="list in courseOption.product_id" :value="list.value" :label="list.display_name" :key="list.value">
                  <Tooltip content="Right Top 文字提示" placement="right-start" width="150">
                    {{list.display_name}}
                  </Tooltip>
              </Option>
            </Select>
          </div>
        </Form-item>
        <Form-item label="选择课时：" prop="course_cost">
          <Select v-model="data.course_cost" placeholder="请选择" :disabled="status === 'finish'">
            <Option v-for="list in courseOption.course_cost" :value="list.value" :key="list.value">{{list.display_name}}</Option>
          </Select>
        </Form-item>
        <Form-item label="上课日期：" prop="date">
          <app-date-picker placeholder="选择日期" v-model="data.date" :disabled="status === 'finish'"></app-date-picker>
        </Form-item>
        <Form-item label="上课时段：" required>
          <Row>
            <Col span="11">
            <Form-item prop="start_at">
              <app-time-picker placeholder="选择开始时间" v-model="data.start_at" format="HH:mm" :disabled="status === 'finish'"></app-time-picker>
            </Form-item>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
            <Form-item prop="end_at">
              <app-time-picker placeholder="选择结束时间" v-model="data.end_at" format="HH:mm" :disabled="status === 'finish'"></app-time-picker>
            </Form-item>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="实际上课课时：" prop="fact_cost" v-if="data.schedule_status === 2">
          <Input type="text" placeholder="请填写课时" v-model="data.fact_cost"></Input>
        </Form-item>
        <Form-item label="学馆师：">{{data.customer_teacher}}</Form-item>
      </Form>
    </div>
  </app-form-modal>
</template>

<script>
  /**
   * 排课管理-添加|编辑
   * @author    chenliangshan
   * @update    2017/07/02
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
        },
      },
    },
    data() {
      return {
        title: '',
        courseOption: {},
        courseModal: false,
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
      }
    },
    created() {
      this.getCourseOption()
    },
    computed: {
      okValue() {
        const status = this.data.schedule_status
        let statusTxt
        switch (status) {
          case 0:
            statusTxt = '确定上课'
            break
          case 1:
            statusTxt = '完成上课'
            break
          case 2:
            statusTxt = '确认课时'
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
