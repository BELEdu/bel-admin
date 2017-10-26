<template>
  <div class="clearfix">

    <!-- 阅卷区域 -->
    <div class="smartexam-check__aside left">

      <!-- 学员列表 -->
      <Card dis-hover>
        <p slot="title">学员列表</p>
        <Row :gutter="15">
          <Col
            span="12"
            v-for="(item,index) in student_data"
            :key="index"
            class="smartexam-check__aside__btn"
          >
            <Button
              :type="buttonFormat(item.test_status,item.id)"
              long
              class="text-right"
              :disabled="item.test_status === 1"
              @click="changeStudentTestId(item.id)"
            >
              <!-- 姓名 -->
              <span class="left">{{item.id}}</span>
              <!-- 未选择设备显示未考试 -->
              <span v-if="item.test_status === 1">(未考)</span>
              <!-- 待阅卷和已阅卷显示得分 -->
              <span >{{item.total_score}}分</span>
              <!-- 已阅卷显示打钩 -->
              <!-- <Icon v-if="item.test_status === 3" type="checkmark-round" /> -->
            </Button>
          </Col>
        </Row>
      </Card>

      <br>

      <!-- 试卷试题 -->
      <Card dis-hover>
        <p slot="title">试题（{{currentStudentName}}）</p>
        <Form
          ref="form"
          class="smartexam-check__form"
          :model="form"
          :rules="rules"
          :label-width="0"
        >
          <!-- 题型 -->
          <div
            v-for="(question_type,tindex) in form.question_types"
            :key="tindex"
          >
            <!-- 题型和得分 -->
            <p class="smartexam-check__form__title">
              {{tindex+1}}.{{question_type.display_name}}
              <span class="color-primary">（得分：{{questionTypeScoreFormat(question_type.questions)}}分）</span>
            </p>
            <!-- 题目 -->
            <Row>
              <Col span="12"
                v-for="(question,qindex) in question_type.questions"
                :key="qindex"
              >
                <Form-item>
                  <!-- 题目下标 -->
                  <Tag :color="indexColorFormat(question.answer_right_wrong)">
                    {{qindex+1}}
                  </Tag>
                  <!-- 题目批改 -->
                  <RadioGroup
                    v-model="question.answer_right_wrong"
                    type="button"
                    size="small"
                    @on-change="(value) => changeQuestionAnswer(value,tindex,qindex)"
                  >
                    <Radio :label="1">
                      <Icon class="color-success" type="checkmark-round" />
                    </Radio>
                    <Radio :label="3" v-if="isHalfWrongQuestion(question.question_template)">
                      <Icon class="color-warning" type="minus-round" />
                    </Radio>
                    <Radio :label="2">
                      <Icon class="color-error" type="close-round" />
                    </Radio>
                  </RadioGroup>
                </Form-item>
              </Col>
            </Row>
          </div>

          <Button
            type="primary"
            long
            @click="beforeSubmit"
          >提交阅卷</Button>

          <!-- <Button
            type="warning"
            long
            @click="beforeSubmit"
          >未交卷</Button> -->

        </Form>
      </Card>

    </div>

    <!-- 试卷区域 -->
    <div class="smartexam-check__sidebar">

    </div>

    <Modal
      v-model="modal.check"
      title="得分与错误知识点"
      width="320"
    >
      <InputNumber
        :min="0"
        :max="form.question_types[tindex].questions[qindex].score"
        v-model="form.question_types[tindex].questions[qindex].answer_score"
      />
      <Checkbox
        v-for="(item,index) in form.question_types[tindex].questions[qindex].question_knowledge"
        v-model="item.right_wrong"
        :key="index"
        :true-value="1"
        :false-value="2"
      >{{item.display_name}}</Checkbox>
    </Modal>

  </div>
</template>

<script>
/**
 * 测试管理 - 智能测试 - 阅卷主组件
 * @author zhoumenglin
 * @version 2017-10-23
 */

import { form } from '@/mixins'
import { mapState } from 'vuex'
import { GLOBAL, EXAMINATION } from '@/store/mutationTypes'


export default {

  mixins: [form],

  data() {
    return {
      button1: 0,

      currentStudentTestId: null, // 当前选中的测试学员的测试id

      form: {},

      rules: {},

      tindex: 0,
      qindex: 0,

      // 半对错弹窗
      modal: {
        check: false,
      },

      // student_data2: [
      //   {
      //     id: 101,
      //     total_score: 0,
      //     test_status: 1,
      //     student: {
      //       display_name: '未考试',
      //     },
      //   },
      //   {
      //     id: 102,
      //     total_score: 10,
      //     test_status: 2,
      //     student: {
      //       display_name: '待阅卷',
      //     },
      //   },
      //   {
      //     id: 103,
      //     total_score: 79,
      //     test_status: 3,
      //     student: {
      //       display_name: '已阅卷',
      //     },
      //   },
      //   {
      //     id: 104,
      //     total_score: 0,
      //     test_status: 4,
      //     student: {
      //       display_name: '参加未提交',
      //     },
      //   },
      //   {
      //     id: 105,
      //     total_score: 20,
      //     test_status: 2,
      //     student: {
      //       display_name: '待阅卷',
      //     },
      //   },
      // ],
    }
  },

  computed: {
    // 参加测试的学员信息
    ...mapState({
      student_data: state => state.examination.smartexam.student_data,
    }),

    // 测试id
    testid() {
      return +this.$route.params.testid
    },

    // 当前选中的学员的姓名
    currentStudentName() {
      if (this.currentStudentTestId) {
        return this.student_data.find(item => item.id === this.currentStudentTestId).id
      }
      return ''
    },

  },

  methods: {
    // 批改答案
    changeQuestionAnswer(value, tindex, qindex) {
      this.tindex = tindex
      this.qindex = qindex
      // console.log(`对错：${value}，tindex：${tindex}，qindex：${qindex}`)

      const currentQuestion = this.form.question_types[tindex].questions[qindex]
      const { score, question_knowledge } = currentQuestion

      switch (value) {
        case 1:
          currentQuestion.answer_score = score
          currentQuestion.question_knowledge = question_knowledge.map(item => ({
            ...item,
            right_wrong: 1,
          }))
          break
        case 2:
          currentQuestion.answer_score = 0
          currentQuestion.question_knowledge = question_knowledge.map(item => ({
            ...item,
            right_wrong: 2,
          }))
          break
        case 3:
          currentQuestion.question_knowledge = question_knowledge.map(item => ({
            ...item,
            right_wrong: item.right_wrong === 0 ? 2 : item.right_wrong,
          }))
          this.modal.check = true
          break
        default:
          break
      }
    },

    // 是否是半对错题型（解答题）
    isHalfWrongQuestion(question_template) {
      switch (question_template) {
        case 4:
          return true
        default:
          return true
      }
    },

    // 下标颜色
    indexColorFormat(ringt_worong) {
      switch (ringt_worong) {
        case 1:
          return 'green'
        case 2:
          return 'red'
        case 3:
          return 'yellow'
        default:
          return 'blue'
      }
    },

    // 题型得分求和
    questionTypeScoreFormat(questions) {
      // eslint-disable-next-line
      return eval(questions.map(item => item.answer_score).join('+'))
    },

    // 学员测试状态 1：待测试（未考试，未选择设备） 2：待阅卷 3：已阅卷 4：待提交
    buttonFormat(test_status, student_test_id) {
      if (this.currentStudentTestId === student_test_id) {
        return 'primary'
      }
      switch (test_status) {
        case 1:
          return 'ghost'
        case 2:
          return 'ghost'
        case 3:
          return 'success'
        case 4:
          return 'dashed'
        default:
          return 'error'
      }
    },

    // 切换学员测试
    changeStudentTestId(student_test_id) {
      this.currentStudentTestId = student_test_id
      this.getPaperData(student_test_id)
    },

    // 获取试卷详情
    getPaperData(student_test_id) {
      return this.$http.get(`/test/paperinspection/${student_test_id}`)
        .then((res) => {
          this.form = res
        })
    },
  },


  created() {
    this.$store.dispatch(EXAMINATION.SMARTEXAM.STUDENT_DATA, this.testid)
      .then(() => {
        // 这里还有待优化，先取第一个学生
        const firstId = this.student_data[0].id
        this.currentStudentTestId = firstId
        this.getPaperData(firstId)
          .then(() => {
            this.$store.commit(GLOBAL.LOADING.HIDE)
          })
      })
  },

}
</script>

<style lang="less">
.smartexam-check {
  &__aside {
    width: 360px;
    padding-right: 20px;

    &__btn{
      margin-bottom: 15px;
    }
  }

  &__sidebar{
    overflow: hidden;
  }

  &__form {
    .ivu-form-item {
      margin-bottom: 10px;
    }

    &__title{
      margin-bottom: 10px;
    }

    .ivu-radio-group-button.ivu-radio-group-small .ivu-radio-wrapper{
       padding: 0 8px;
    }

  }
}
</style>
