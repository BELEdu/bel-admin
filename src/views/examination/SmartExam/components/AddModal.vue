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
      <div class="text-center">
        <p>
          <strong>{{step}}</strong> Of <strong>{{stepLength}}</strong>
        </p>
      </div>

      <div class="smartexam-add-modal__form">
        <!-- 表单 -->
        <Form
          v-show="step===1"
          ref="form"
          :model="form"
          :rules="rules"
          :label-width="80"
        >
          <app-form-alert :errors="formErrors"></app-form-alert>

          <Form-item label="测试类型">
            <RadioGroup
              v-model="form.exam_type"
              type="button"
              @on-change="changeExamType"
            >
              <Radio :label="0">日常测试</Radio>
              <Radio :label="1">课后练习</Radio>
            </RadioGroup>
          </Form-item>

          <Form-item
            label="测试对象"
            prop="id"
            v-if="value"
          >
            <Select
              placeholder="请选择测试对象..."
              v-model="form.id"
              filterable
            >
              <Option
                v-for="item in classData"
                :value="item.value"
                :key="item.value"
              >{{ item.display_name }}</Option>
            </Select>
          </Form-item>

          <Form-item label="课序" prop="order">
            <Select
              placeholder="请选择课序..."
              v-model="form.order"
            >
              <Option
                v-for="item in orderData"
                :value="item.value"
                :key="item.value"
              >{{ item.display_name }}</Option>
            </Select>
          </Form-item>

          <Form-item label="考试时长" prop="duraction">
            <InputNumber
              :step="5"
              :min="0"
              v-model="form.duraction"
            ></InputNumber>
            &nbsp;&nbsp;分钟
          </Form-item>

          <Form-item label="答题方式">
            <RadioGroup v-model="form.answer_type" type="button">
              <Radio :label="0" :disabled="isPractice">线上答题</Radio>
              <Radio :label="1" :disabled="isPractice">线下答题</Radio>
            </RadioGroup>
          </Form-item>

          <Form-item label="试卷来源">
            <RadioGroup v-model="form.paper_from" type="button">
              <Radio :label="0" :disabled="isPractice">智能组卷</Radio>
              <Radio :label="1" :disabled="isPractice">选择试卷</Radio>
            </RadioGroup>
          </Form-item>

          <Form-item
            label="选择试卷"
            prop="peper_select"
            v-show="form.paper_from === 1"
            required
          >
            <Select
              placeholder="请选择试卷..."
              v-model="form.peper_select"
              filterable
            >
              <Option
                v-for="item in paperData"
                :value="item.value"
                :key="item.value"
              >{{ item.display_name }}</Option>
            </Select>
          </Form-item>

          <Form-item
            label="题型题量"
            v-show="form.paper_from === 0"
            prop="question_type"
          >
            <Row>
              <Col span="8"
                class="smartexam-add-modal__questionType"
                v-for="(item,index) in form.question_type"
                :key="index"
              >
                <span>{{form.question_type[index].name}}</span>
                <InputNumber
                  :min="0"
                  v-model="form.question_type[index].amount"
                ></InputNumber>
              </Col>
            </Row>
          </Form-item>
        </Form>

      </div>


      <!-- 试卷展示 -->
      <div v-if="step===2">
        题目展示组件
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

export default {
  name: 'app-examination-smartexam-add-modal',

  mixins: [form],

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
        exam_type: 0, // 测试类型
        id: null, // 测试对象（班级）
        order: null, // 课序
        duraction: 0, // 考试时长
        answer_type: 0, // 答题方式
        paper_from: 0, // 试卷来源
        peper_select: null, // 选择试卷
        question_type: [
          {
            id: 1,
            name: '选择题',
            amount: 0,
          },
          {
            id: 2,
            name: '判断题',
            amount: 0,
          },
          {
            id: 3,
            name: '填空题',
            amount: 0,
          },
          {
            id: 4,
            name: '计算题',
            amount: 0,
          },
          {
            id: 5,
            name: '解答题',
            amount: 0,
          },
        ],
      },

      rules: {
        id: [
          this.$rules.required('测试对象', 'number', 'change'),
        ],
        order: [
          this.$rules.required('课序', 'number', 'change'),
        ],
        duraction: [
          { validator: this.duractionCheck, trigger: 'change' },
        ],
        peper_select: [
          { validator: this.peperSelectCheck, trigger: 'change' },
        ],
        question_type: [
          { validator: this.questionTypeCheck, trigger: 'change' },
        ],
      },

      // 测试对象假数据源
      classData: [
        {
          display_name: '初一数学加强尖子一对一班 000001',
          value: 1,
        },
        {
          display_name: '初三物理衔接基础班一对多  000002',
          value: 2,
        },
        {
          display_name: '初二化学同步基础班一对多  000003',
          value: 3,
        },
      ],

      // 测试对象假数据源
      orderData: [
        {
          display_name: '第1节课',
          value: 1,
        },
        {
          display_name: '第2节课',
          value: 2,
        },
        {
          display_name: '第3节课',
          value: 3,
        },
      ],

      // 测试对象假数据源
      paperData: [
        {
          display_name: '2017初三上学期市质检',
          value: 1,
        },
        {
          display_name: '2017年3月全市模拟考',
          value: 2,
        },
        {
          display_name: '2016中考真题',
          value: 3,
        },
      ],
    }
  },

  computed: {
    isPractice() { // 是否是课堂练习
      return this.form.exam_type === 1
    },
  },

  methods: {
    // 考试时长校验
    duractionCheck(rule, value, callback) {
      if (value < 1) {
        callback(new Error('请设置考试时长'))
      } else {
        callback()
      }
    },

    // 题型题量校验
    questionTypeCheck(rule, value, callback) {
      if (this.form.paper_from === 0) {
        if (value.some(item => item.amount !== 0)) {
          callback()
        }
        callback(new Error('请至少分配一种题型题量'))
      } else {
        callback()
      }
    },

    // 选择试卷校验
    peperSelectCheck(rule, value, callback) {
      if (this.form.paper_from === 1) {
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
      if (item === 1) {
        this.form.answer_type = 1
        this.form.paper_from = 0
      }
    },

    submit() {
      this.$Message.success('提交！')
    },

    handleReset() {
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
      this.step = 1
    },

    closeModal() {
      this.$emit('closeAddModal')
      this.handleReset()
    },

    // 下一步
    nextStep() {
      if (this.step === 1) {
        // 在这里用算法获取试题数据
        // this.questionList = qdata
        // 先校验
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.step = this.step + 1
          }
        })
      } else {
        this.step = this.step + 1
      }
    },

    // 上一步
    lastStep() {
      this.step = this.step - 1
    },
  },
}
</script>

<style lang="less">
.smartexam-add-modal{
  &__form{
    margin: auto;
    width: 500px;
    margin-top: 15px;
  }

  .ivu-radio-group-button .ivu-radio-wrapper {
    width: 200px;
  }

  &__questionType{
    margin-bottom: 10px;

    &>span {
      margin-right: 10px;
    }
  }
}
</style>
