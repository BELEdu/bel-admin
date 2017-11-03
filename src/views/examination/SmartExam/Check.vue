<template>
  <div
    class="smartexam-check clearfix"
    v-if="form"
  >

    <!-- 阅卷区域 -->
    <aside class="smartexam-check__aside">

      <!-- 折叠面板 -->
      <Collapse
        v-model="collapseData"
        class="smartexam-check__collapse"
      >

        <!-- 学员面板 -->
        <Panel name="panelStudent">
          学员列表
          <section slot="content">
            <!-- 小贴士 -->
            <div class="smartexam-check__aside__tips">
              <Tag>未考试</Tag>
              <Tag type="border">待交卷</Tag>
              <Tag type="border" color="blue">待阅卷</Tag>
              <Tag color="green">已阅卷</Tag>
              <Tag color="blue">已选中</Tag>
            </div>
            <!-- 学员按钮 -->
            <Row :gutter="15" class="smartexam-check__aside__student-wrap">
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
                  :disabled="item.test_status === 2"
                  @click="changeStudentTestId(item.id)"
                >
                  <!-- 姓名 -->
                  <span class="left">{{item.id}}</span>
                  <!-- 未选择设备显示未考试 -->
                  <span v-if="item.test_status === 2">(未考)</span>
                  <!-- 待阅卷和已阅卷显示得分 -->
                  <span >{{item.total_score}}分</span>
                  <!-- 已阅卷显示打钩 -->
                  <!-- <Icon v-if="item.test_status === 3" type="checkmark-round" /> -->
                </Button>
              </Col>
            </Row>
          </section>
        </Panel>

        <!-- 阅卷面板 -->
        <Panel name="panelCheck">
          试题（{{currentStudentName}}）
          <span class="right martexam-check__aside__score">
            得分：
            <span class="color-error">
              {{currentStudentTotalScore}} / {{currentPaperTotalScore}}
            </span>
          </span>
          <section slot="content">
            <Form
              ref="form"
              class="smartexam-check__form"
              :model="form"
              :rules="rules"
              :label-width="0"
            >
              <app-form-alert :errors="formErrors"></app-form-alert>

              <!-- 容器 -->
              <div class="smartexam-check__aside__check-wrap">
                <!-- 题型区域 -->
                <div
                  v-for="(question_type,tindex) in form.question_types"
                  :key="tindex"

                >
                  <!-- 题型名称 & 题型得分 -->
                  <p class="smartexam-check__form__title">
                    {{tindex+1}}.{{question_type.display_name}}
                    <span class="color-primary ">
                      （得分：{{questionTypeScoreFormat(question_type.questions)}} / {{question_type.total_score}}）
                    </span>
                  </p>
                  <!-- 题目 -->
                  <Row>
                    <Col span="12"
                      v-for="(question,qindex) in question_type.questions"
                      :key="qindex"
                      class="smartexam-check__form__item"
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

              </div>

              <!-- 提交阅卷 -->
              <Button
                class="smartexam-check__form__submit"
                type="primary"
                long
                :loading="formLoading"
                @click="submit"
              >提交阅卷</Button>

              <Button
                class="smartexam-check__form__submit"
                type="warning"
                long
                :loading="formLoading"
                @click="submit"
              >未交卷</Button>

            </Form>

          </section>

        </Panel>
      </Collapse>

    </aside>

    <!-- 展示（上传图片）区域 -->
    <div class="smartexam-check__sidebar">

      <!-- 试卷公共头部 -->
      <paper-preview-header
        :data="form"
      ></paper-preview-header>

      <!-- 阅卷（线上） -->
      <section
        class="smartexam-check__online"
        v-if="true"
      >
        <!-- 待交卷 -->
        <Alert
          type="warning"
          show-icon
        >
          <span slot="desc">
              未提交答卷
          </span>
        </Alert>

        <!-- 试卷详情展示 -->
        <paper-preview-detail :data="form"></paper-preview-detail>

      </section>

      <!-- 阅卷（线下） -->
      <section
        class="smartexam-check__offline"
        v-if="true"
      >
        <!-- 待上传 -->
        <Alert type="warning"
          v-if="uploadList.length === 0"
          show-icon
        >
          <span slot="desc">
            未上传学员答卷
          </span>
        </Alert>

        <!-- 上传区域 -->
        <paper-upload
          :dataList="uploadList"
          @changeList="changeList"
        ></paper-upload>
      </section>

    </div>

    <!-- 半对错得分弹窗 -->
    <Modal
      v-model="modal.check"
      title="得分与错误知识点"
      width="320"
      class="smartexam-check__modal"
    >
      <!-- 得分 -->
      <p class="color-primary">请给出该题得分（总分：{{form.question_types[tindex].questions[qindex].score}}）</p>
      <InputNumber
        :step="1"
        :min="0"
        :max="form.question_types[tindex].questions[qindex].score"
        v-model="form.question_types[tindex].questions[qindex].answer_score"
      />
      <!-- 关联知识点 -->
      <p class="color-primary">请选择该题错误的知识点</p>
      <ul>
        <li
          v-for="(item,index) in form.question_types[tindex].questions[qindex].question_knowledge"
          :key="index"
        >
          <Checkbox
            v-model="item.right_wrong"
            :true-value="2"
            :false-value="1"
          >{{item.display_name}}</Checkbox>
        </li>
      </ul>
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
import PaperPreviewDetail from './components/PaperPreviewDetail'
import PaperPreviewHeader from './components/PaperPreviewHeader'
import PaperUpload from './components/PaperUpload'

export default {
  name: 'app-examination-smartexam-check',

  mixins: [form],

  components: {
    PaperPreviewHeader,
    PaperPreviewDetail,
    PaperUpload,
  },

  data() {
    return {
      collapseData: ['panelStudent', 'panelCheck'], // 折叠面板控制

      currentStudentTestId: null, // 当前选中的测试学员的测试id

      form: null, // 阅卷表单

      rules: {},

      tindex: 0, // 题型index
      qindex: 0, // 题目index

      // 半对错弹窗
      modal: {
        check: false,
      },

      // 线下阅卷假数据
      uploadList: [
        {
          name: '试卷1',
          url: '/data/head_url/201711/59fc1d10a0fd1.jpg',
        },
        {
          name: '试卷2',
          url: '/data/head_url/201711/59fc1d40da5c4.jpg',
        },
        {
          name: '试卷3',
          url: '/data/head_url/201711/59fc1d5e6123e.jpg',
        },
        {
          name: '试卷4',
          url: '/data/head_url/201711/59fc1d70a9353.jpg',
        },
        {
          name: '试卷5',
          url: '/data/head_url/201711/59fc1d86b0840.jpg',
        },
      ],
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

    // 当前学员的所有试题组成的数组
    currentQuestionArray() {
      return this.form.question_types
        .map(question_type => question_type.questions)
        .reduce((acc, arr) => [...acc, ...arr], [])
    },

    // 当前选中的学员的得分总分
    currentStudentTotalScore() {
      if (this.currentQuestionArray) {
        return this.currentQuestionArray
          .map(question => question.answer_score)
          .reduce((total, score) => total + score, 0)
      }
      return 0
    },

    // 当前选中的学员的试卷总分
    currentPaperTotalScore() {
      if (this.form.question_types) {
        return this.form.question_types
          .map(question_type => question_type.total_score)
          .reduce((total, score) => total + score, 0)
      }
      return 0
    },

    // 是否已经阅完了所有的题目
    needToCheckContinue() {
      return this.currentQuestionArray
        .map(question => question.answer_right_wrong)
        .some(item => item === 0)
    },
  },

  methods: {
    // 提交阅卷
    submit() {
      if (this.needToCheckContinue) {
        this.$Message.error('尚未批改全部试题！')
      } else {
        this.formLoading = true
        this.$http.post(`/test/doinspection/${this.currentStudentTestId}`, this.form)
          .then(this.successHandler)
          .catch(this.errorHandler)
      }
    },

    // 提交成功回调
    successHandler() {
      this.$store.dispatch(EXAMINATION.SMARTEXAM.STUDENT_DATA, this.testid)
      this.formLoading = false
      this.$Message.success('提交成功！')
    },

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
          currentQuestion.answer_score = 0
          currentQuestion.question_knowledge = question_knowledge.map(item => ({
            ...item,
            right_wrong: 1,
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
          return false
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
      if (questions) {
        return questions
          .map(question => question.answer_score)
          .reduce((total, score) => total + score, 0)
      }
      return 0
    },

    // 学员测试状态 1：待测试（未考试，未选择设备） 2：待阅卷 3：已阅卷 4：待提交
    buttonFormat(test_status, student_test_id) {
      if (this.currentStudentTestId === student_test_id) {
        return 'primary'
      }
      switch (test_status) {
        // 待阅卷
        case 0:
          return 'ghost'
        // 已阅卷
        case 1:
          return 'success'
        case 2:
          return 'ghost'
        case 3:
          return 'success'
        case 4:
          return 'dashed'
        default:
          return 'ghost'
      }
    },

    // 切换测试学员
    changeStudentTestId(student_test_id) {
      this.currentStudentTestId = student_test_id
      this.getPaperData(student_test_id)
    },

    // 获取试卷详情
    getPaperData(student_test_id) {
      return this.$http.get(`/test/paperinspection/${student_test_id}`)
        .then((res) => {
          this.form = res
          this.$emit('scrollToTop')
        })
        .catch(({ message }) => {
          this.$Message.error(message)
        })
    },

    // 上传图片成功回调
    changeList(array) {
      this.uploadList = [
        ...this.uploadList,
        ...array,
      ]
    },
  },

  created() {
    this.$store.dispatch(EXAMINATION.SMARTEXAM.STUDENT_DATA, this.testid)
      .then(() => {
        // 这里还有待优化，先取第一个学生
        const firstStudentId = this.student_data[0].id
        this.currentStudentTestId = firstStudentId
        this.getPaperData(firstStudentId)
          .then(() => {
            this.$store.commit(GLOBAL.LOADING.HIDE)
          })
      })
  },

}
</script>

<style lang="less">
.smartexam-check {

  &__collapse {
    &.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header{
      padding: 0 16px;
      &>i{
        margin-right: 10px;
      }
    }
  }

  &__aside {
    width: 336px;
    position: fixed;
    z-index: 999;

    &__btn {
      margin: 7.5px 0;
    }

    &__tips {
      margin-bottom: 10px;
    }

    &__score {
      margin-right: 10px;
    }

    &__student-wrap {
      max-height: 185px;
      overflow: auto;
    }

    &__check-wrap {
      max-height: 300px;
      overflow: auto;
    }

  }

  &__sidebar{
    margin-left: 366px;
    overflow: hidden;
    width: 885px;

    &__offline {}

    &__online {}
  }

  &__form {
    .ivu-form-item {
      margin-bottom: 5px;
    }

    &__title{
      margin-bottom: 5px;
    }

    .ivu-radio-group-button.ivu-radio-group-small .ivu-radio-wrapper{
       padding: 0 8px;
    }

    &__item{
      padding-left: 12px;
    }

    &__submit{
      margin-top: 15px;
    }
  }

  &__modal{
    .ivu-input-number {
      margin-bottom: 10px;
    }
    p {
      margin-bottom: 10px;
    }

  }
}
</style>
