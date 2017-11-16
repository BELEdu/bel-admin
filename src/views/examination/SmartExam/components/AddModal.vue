<template>
  <div class="smartexam-add-modal">
    <Modal
      :value="value"
      @input="value => $emit('input', value)"
      title="添加测试"
      @on-cancel="closeModal"
      width="950"
    >
      <!-- 头部信息展示 -->
      <Steps
        :current="step-1"
        class="steps-fix"
        size="small"
      >
        <Step title="填写测试对象信息"></Step>
        <Step title="预览 / 编辑试卷"></Step>
        <Step title="提交"></Step>
      </Steps>

      <!-- 表单 -->
      <Form
        ref="form"
        v-if="value"
        :model="form"
        :rules="rules"
        :label-width="80"
      >
        <app-form-alert
          class="smartexam-add-modal__alert"
          :errors="formErrors"
          fullWidth
        ></app-form-alert>

        <!-- 第一步信息填写 -->
        <div v-show="step===1" class="smartexam-add-modal__form">

          <Form-item label="测试类型" required>
            <RadioGroup
              v-model="form.test_type"
              type="button"
              @on-change="changeExamType"
            >
              <Radio :label="1">日常测试</Radio>
              <Radio :label="4">课后练习</Radio>
            </RadioGroup>
          </Form-item>

          <Form-item
            label="测试对象"
            prop="model_id"
            v-if="value"
          >
            <Select
              placeholder="请输入关键字检索测试对象..."
              v-model="form.model_id"
              filterable
              remote
              :remote-method="remoteMethodClasses"
              :loading="loading.classes"
            >
              <Option
                v-for="item in classesData"
                :value="item.id"
                :key="item.id"
              >{{ item.classes_name }}</Option>
            </Select>
          </Form-item>

          <Form-item label="课序" prop="course_id">
            <Select
              placeholder="请选择课序..."
              v-model="form.course_id"
            >
              <Option
                v-for="item in courseInfo"
                :value="item.id"
                :key="item.id"
              >第{{ item.sort_value }}节课</Option>
            </Select>
          </Form-item>

          <Form-item
            v-show="!isPractice"
            label="考试时长"
            required
          >
            <InputNumber
              :step="5"
              :min="0"
              v-model="form.duration"
            ></InputNumber>
            &nbsp;&nbsp;分钟
          </Form-item>

          <Form-item label="答题方式" required>
            <RadioGroup v-model="form.answer_type" type="button">
              <Radio :label="1" :disabled="isPractice">线上答题</Radio>
              <Radio :label="2" :disabled="isPractice">线下答题</Radio>
            </RadioGroup>
          </Form-item>

          <Form-item label="试卷来源" required>
            <RadioGroup v-model="form.paper_source" type="button">
              <Radio :label="1" :disabled="isPractice">智能组卷</Radio>
              <Radio :label="2" :disabled="isPractice">选择试卷</Radio>
            </RadioGroup>
          </Form-item>

          <Form-item
            label="选择试卷"
            prop="paper_id"
            v-show="!isSmartPaper"
            required
          >
            <Select
              placeholder="请输入关键字检索试卷..."
              v-model="form.paper_id"
              filterable
              remote
              :remote-method="remoteMethodPaper"
              clearable
              :loading="loading.paper"
            >
              <Option
                v-for="item in paperData"
                :value="item.id"
                :key="item.id"
              >{{ item.display_name }}</Option>
            </Select>
          </Form-item>

          <Form-item
            label="题型题量"
            v-show="isSmartPaper && form.param.length>0"
            prop="param"
            required
          >
            <Row>
              <Col span="8"
                class="smartexam-add-modal__questionType"
                v-for="(item,index) in form.param"
                :key="index"
              >
                <span>{{form.param[index].display_name}}</span>
                <InputNumber
                  :min="0"
                  v-model="form.param[index].value"
                ></InputNumber>
              </Col>
            </Row>
          </Form-item>

        </div>
      </Form>

      <!-- 第二步试卷展示 -->
      <div v-if="step===2">

        <!-- 选择学员 -->
        <Select v-model="currentStudent" filterable>
          <Option
            v-for="student in form.question_info"
            :value="student.student_id"
            :key="student.student_id"
          >{{ student.display_name }}</Option>
        </Select>

        <!-- 全部学生的试卷 -->
        <div v-for="( student , index ) in form.question_info" :key="index">

          <!-- 学生个人试卷区域 -->
          <div
            class="smartexam-add-modal__paper-ection"
            v-show="student.student_id === currentStudent"
          >
            <paper-preview-section
              v-for="( section , sindex ) in student.question_types"
              v-if="section.questions.length>0"
              :key="sindex"
              :data="section"
              :s-index="sindex+1"
              :v-index="v_figureViewIndex(sindex, student.question_types)"
            ></paper-preview-section>
          </div>

        </div>

      </div>

      <!-- 自定义底部 -->
      <div slot="footer">
        <Button
          type="ghost"
          size="large"
          @click="closeModal"
        >取消</Button>

        <Button
          v-if="step > 1"
          type="primary"
          size="large"
          @click="lastStep"
        >上一步</Button>

        <Button
          v-if="step < stepLength"
          type="primary"
          size="large"
          :loading="formLoading"
          @click="nextStep"
        >下一步</Button>

        <Button
          v-show="step === stepLength"
          type="primary"
          size="large"
          :loading="formLoading"
          @click="beforeSubmit"
        >提交</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
/**
 * 测试管理 - 智能测试 - 添加测试弹窗
 * @author zhoumenglin
 * @version 2017-10-18
 */
import { form } from '@/mixins'
import { PaperPreviewSection } from '@/views/components'

export default {
  name: 'app-examination-smartexam-add-modal',

  mixins: [form],

  components: {
    PaperPreviewSection,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      step: 1,
      stepLength: 2,

      form: {
        model_type: 'classes', // 不知道干嘛的，固定写这个
        test_type: 1, // 测试类型 1：日常测试 4：课后练习
        model_id: null, // 测试对象（班级）
        course_sort: null, // 课序
        course_id: null, // 该课序的id
        duration: 0, // 考试时长
        answer_type: 1, // 答题方式 1：线上 2：线下
        paper_source: 1, // 试卷来源 1：智能组卷 2：选择试卷
        paper_id: null, // 选择试卷
        question_info: [], // 试题信息
        param: [], // 题型题量
      },

      rules: {
        model_id: [
          this.$rules.required('测试对象', 'number', 'change'),
        ],
        course_id: [
          this.$rules.required('课序', 'number', 'change'),
        ],
        paper_id: [
          { validator: this.peperSelectCheck, trigger: 'change' },
        ],
        param: [
          { validator: this.questionTypeCheck, trigger: 'change' },
        ],
      },

      loading: {
        classes: false,
        paper: false,
      },

      // 测试对象数据源
      classesData: [],

      // 选择试卷数据源
      paperData: [],

      // 课序数据源
      courseInfo: [],

      currentStudent: null,
    }
  },

  computed: {
    isPractice() { // 是否是课后练习
      return this.form.test_type === 4
    },

    currentSubjectType() { // 当前选中班级的学科id
      if (this.form.model_id) {
        return this.classesData.find(item => item.id === this.form.model_id).subject_type
      }
      return null
    },

    isSmartPaper() { // 试卷来源是否为智能组卷
      return this.form.paper_source === 1
    },

  },

  watch: {
    // 每当测试对象变化时重新获取题型题量和课序
    'form.model_id': function formModelId(val) {
      if (val) {
        this.form.course_id = null
        this.form.course_sort = null

        this.$http.get(`/test/classes_info/${val}`)
          .then((res) => {
            this.courseInfo = res.courseInfo
            this.form.param = res.questionInfo.map(({ id, display_name }) => ({
              id,
              display_name,
              value: 0,
            }))
          })
      }
    },

    // 每当课序改变时，从课时数据源中查出这个课序的id
    'form.course_id': function formCourseSort(val) {
      if (val) {
        this.form.course_sort = this.courseInfo.find(item => item.id === val).sort_value
      }
    },
  },

  methods: {
    // 处理题型模板中的index
    v_figureViewIndex(sIndex, data) {
      return data.reduce((
        acc,
        section,
        index,
      ) => {
        if (section.questions.length && sIndex > index) {
          return acc + 1
        }
        return acc
      }, 1)
    },

    // 测试对象select远程搜索（自动补全）
    remoteMethodClasses(query) {
      if (query !== '') {
        this.loading.classes = true
        this.$http.get(`/test/classes_autocomplete?classes_name=${query}`)
          .then((res) => {
            this.classesData = res
            this.loading.classes = false
          })
      } else {
        this.classesData = []
      }
    },

    // 试卷select远程搜索（自动补全）
    remoteMethodPaper(query) {
      if (query !== '') {
        if (this.currentSubjectType) {
          this.loading.paper = true
          this.$http.get(`/test/paper_autocomplete?subject_type=${this.currentSubjectType}&display_name=${query}`)
            .then((res) => {
              this.paperData = res
              this.loading.paper = false
            })
        } else {
          this.$Message.warning('请先选择测试对象')
        }
      } else {
        this.paperData = []
      }
    },

    // 题型题量表单自定义校验
    questionTypeCheck(rule, value, callback) {
      if (this.form.paper_source === 1) {
        if (value.some(item => item.value !== 0)) {
          callback()
        }
        callback(new Error('请至少分配一种题型题量'))
      } else {
        callback()
      }
    },

    // 选择试卷表单自定义校验
    peperSelectCheck(rule, value, callback) {
      if (this.form.paper_source === 2) {
        if (value) {
          callback()
        } else {
          callback(new Error('请选择试卷'))
        }
      } else {
        callback()
      }
    },

    // 选择课后练习时，当前答题方式固定为线下、试卷来源固定为智能组卷
    changeExamType(item) {
      if (item === 4) {
        this.form.answer_type = 2
        this.form.paper_source = 1
      }
    },

    // 提交
    submit() {
      if (this.step === 1) {
        this.getQuestionInfo()
      } else {
        this.$http.post('/test', this.form)
          .then(this.successHandler)
          .catch(this.errorHandler)
      }
    },

    // 提交成功回调
    successHandler() {
      this.$Message.success('测试添加成功')
      this.formLoading = false
      this.closeModal()
      this.$emit('update')
    },

    // 重置表单
    handleReset() {
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
      this.step = 1
    },

    // 关闭模态框
    closeModal() {
      this.$emit('closeAddModal')
      this.handleReset()
    },

    // 下一步
    nextStep() {
      if (this.step === 1) {
        this.beforeSubmit()
      } else {
        this.step = this.step + 1
      }
    },

    // 上一步
    lastStep() {
      this.step = this.step - 1
    },

    // 根据第一步的参数获取试题数据
    getQuestionInfo() {
      return this.$http.post('/test/next', this.form)
        .then((res) => {
          this.formLoading = false
          this.form.question_info = res.question_info
          // 筛选出第一项的学生的id
          this.currentStudent = this.form.question_info[0].student_id
          this.step = this.step + 1
        })
        .catch(this.errorHandler)
    },
  },
}
</script>

<style lang="less">
.smartexam-add-modal {

  &__alert {
    margin-top: 15px;
  }

  &__form {
    margin: auto;
    width: 600px;
    margin-top: 15px;
  }

  .ivu-radio-group-button .ivu-radio-wrapper {
    width: 200px;
  }

  &__questionType {
    margin-bottom: 10px;

    &>span {
      margin-right: 10px;
    }
  }

  &__paper-ection {
    margin-top: 15px;
  }
}
</style>
