<template>
  <div class="prepareplan-edit-modal">
    <Modal
      :value="value"
      @input="value => $emit('input', value)"
      :title="title"
      :mask-closable="false"
      :closable="false"
      @on-cancel="beforeCloseModal"
      width="850"
    >

      <!-- 头部信息展示 -->
      <div class="prepareplan-edit-modal__header">

        <Steps
          :current="step-1"
          class="steps-fix"
          size="small"
        >
          <Step title="编辑解析"></Step>
          <Step title="PPT"></Step>
          <Step title="课堂练习"></Step>
          <Step title="提交" v-if="!isShow"></Step>
        </Steps>

      </div>

      <!-- 表单 -->
      <Form
        v-if="value"
        ref="form"
        :model="form"
        :label-width="0"
      >
        <app-form-alert
          :errors="formErrors"
          fullWidth
        ></app-form-alert>

        <!-- 表单区域 -->
        <div class="prepareplan-edit-modal__wrap" v-if="step === 1 || step === 2">

          <!-- 加载loading -->
          <Spin v-if="!editorLoadOk" fix>编辑器正在加载中...</Spin>

          <!-- 教案内容 -->
          <Form-item v-show="step === 1">

            <!-- 教案预览 -->
            <div class="prepareplan-edit-modal__preview">
              <Button
                v-if="editorLoadOk"
                type="warning"
                icon="search"
                @click="previewPreparePlan"
              >教案预览</Button>
            </div>

            <!-- 富文本编辑器 -->
            <app-editor
              v-if="editorFirstRender"
              ref="myEditor"
              :height="600"
              v-model="form.content"
              @init="() => this.editorLoadOk = true"
            ></app-editor>

          </Form-item>

          <!-- PPT上传步骤 -->
          <div v-show="step === 2">

            <!-- ppt列表 -->
            <Form-item
              v-for="(ppt,index) in form.attachments"
              :key="index"
            >
              <Row>
                <!-- PPT标题 -->
                <Col :span="10" :offset="4">
                  <Form-item>
                    <Input
                      v-model="ppt.display_name"
                      :readonly="isShow"
                      placeholder="请输入PPT课件标题"
                    ></Input>
                  </Form-item>
                </Col>

                <!-- 预览ppt -->
                <Col :span="2" :offset="1">
                  <Button
                    type="warning"
                    icon="search"
                    long
                    @click="beforePreview(ppt.url,ppt.display_name)"
                  >预览</Button>
                </Col>

                <!-- 删除ppt -->
                <Col :span="2" :offset="1">
                  <Button
                    type="error"
                    icon="close"
                    long
                    :disabled="isShow"
                    @click="remove(index)"
                  >删除</Button>
                </Col>
              </Row>
            </Form-item>

            <!-- 上传组件和Alert组件 -->
            <Row>
              <Col :span="16" :offset="4">
                <!-- 缺省提示 -->
                <Alert
                  class="prepareplan-edit-modal__alert"
                  v-if="form.attachments.length === 0"
                  type="warning"
                  show-icon
                >
                  <template slot="desc">
                    尚未添加PPT课件
                  </template>
                </Alert>

                <!-- ppt压缩包上传组件 -->
                <zip-upload
                  v-if="!isShow"
                  @on-success="add"
                ></zip-upload>

              </Col>
            </Row>

          </div>

        </div>
        <!-- 表单区域结束 -->

      </Form>

      <!-- 推荐试题 -->
      <div v-if="step === 3">
        <!-- 按钮 -->
        <div class="prepareplan-edit-modal__refresh text-right">
          <!-- 推一批题目 -->
          <Button
            v-if="!isShow"
            type="primary"
            icon="plus"
            :loading="questionLoading"
            @click="getQuestionInfo"
          >推一批</Button>

          <!-- 手动选题 -->
          <Button
            v-if="!isShow"
            type="warning"
            icon="android-cart"
            @click="changeQuestions"
          >手动换题</Button>

        </div>

        <!-- 试题列表组件 -->
        <question-list
          :data="form.questions"
          :show-action="!isShow"
          :width="818"
        ></question-list>

      </div>


      <!-- 自定义底部 -->
      <div slot="footer">

        <!-- 校验提示-->
        <p
          class="left color-error prepareplan-edit-modal__tips"
        >
          <span v-if="!canAdd && step === 2">
            每个PPT的课件标题均必填
          </span>
          <span v-if="isEmptyQuestion && step === 3 ">
            课堂练习题目不能为空
          </span>
        </p>

        <Button
          type="ghost"
          size="large"
          @click="beforeCloseModal"
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
          :disabled="!canAdd && step === 2"
          @click="beforeNextStep"
        >下一步</Button>

        <Button
          v-show="!isShow && step === stepLength"
          type="primary"
          size="large"
          :disabled="isEmptyQuestion && step === 3"
          :loading="formLoading"
          @click="submit"
        >提交</Button>

      </div>
    </Modal>

    <!-- ppt上传进度弹窗 -->
    <ProgressModal
      :visible.sync="ppt.visible"
      :data="ppt.data"
      :name="ppt.name"
    ></ProgressModal>

  </div>
</template>

<script>
/**
 * 教案管理 - 添加 & 编辑 & 查看教案弹窗
 * @author zml
 * @version 2017-10-17
 */

import { form } from '@/mixins'
import { Question } from '@/views/components'
import QuestionList from './QuestionList'
import ZipUpload from './ZipUpload'
import ProgressModal from './ProgressModal'

export default {
  name: 'app-prepare-prepareplan-edit-modal',

  mixins: [form],

  components: {
    Question,
    QuestionList,
    ZipUpload,
    ProgressModal,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
    isCreate: {
      type: Boolean,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    isShow: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {

      step: 1, // 当前步骤
      stepLength: 3, // 步骤总数

      questionLoading: false, // 智能推题loading

      newWin: null, // 用于打开手动选题标签的对象

      editorFirstRender: false, // 是否第一次加载（用于加载编辑器静态文件）
      editorLoadOk: false, // 编辑器是否加载完毕

      hasQuestions: false, // 是否已经智能推送过题目

      ppt: {
        url: '', // 当前ppt的url地址
        name: '', // 当前ppt的ppt标题
        data: {}, // 预览相关数据
        visible: true, // 展示状态
      },
    }
  },

  computed: {
    // modal标题
    title() {
      const text = `${this.form.classes_name} —— 第 ${this.form.sort_value} 节课`
      if (this.isCreate) {
        return `添加教案：${text}`
      } else if (this.isEdit) {
        return `编辑教案：${text}`
      }
      return `查看教案：${text}`
    },

    // 是否可添加
    canAdd() {
      const pptArray = this.form.attachments
      const urlOk = !pptArray.map(({ url }) => url).some(url => url === '')
      const nameOk = !pptArray.map(({ display_name }) => display_name).some(name => name === '')
      return urlOk && nameOk
    },

    // 校验用户输入的是否是网址，返回是否匹配,true匹配，false不匹配
    // isMatchUrl() {
    //   const pptArray = this.form.attachments
    //   const reg = /^https:\/\/saas-ppt\.aikaola\.com\/.*$/
    //   const hasNoMatch = pptArray.map(({ url }) => url).some(url => !(reg.test(url)))
    //   return !hasNoMatch
    // },

    // 判断是否无课堂练习
    isEmptyQuestion() {
      return this.form.questions.length === 0
    },

    // 基础的questionTypes结构
    questionTypesArray() {
      const types = []

      this.form.questions.forEach((question) => {
        // 先获取当前types数组中的每项id，组成新数组用于下面的判断
        const type_ids = types.map(({ question_type_id }) => question_type_id)

        // 如果不重复，就push进去
        if (!(type_ids.includes(question.question_type_id))) {
          types.push({
            question_type_id: question.question_type_id,
            questions: [],
          })
        }
      })

      // 返回一个基础的questionTypes结构
      return types
    },

    // 将当前的习题转换成试卷的结构
    questionToPaper() {
      const questionTypesArray = this.questionTypesArray
      const questions = this.form.questions

      questions.forEach((question) => {
        questionTypesArray.forEach((types) => {
          if (types.question_type_id === question.question_type_id) {
            types.questions.push(question)
          }
        })
      })

      return questionTypesArray
    },

  },

  watch: {
    // 监听：当弹窗为打开状态时，调用编辑器的setData方法将格式化后的HTML代码注入
    value(val) {
      if (val) {
        this.editorFirstRender = val
        this.$nextTick(() => {
          if (this.$refs.myEditor.editor) {
            this.$refs.myEditor.editor.setData(this.form.content)
          }
        })
      }
    },
  },

  methods: {
    // 试卷预览
    previewPreparePlan() {
      localStorage.removeItem('previewPreparePlan')
      const url = '/preview-prepareplan'
      window.open(url, String(Date.now()), '', false)
      localStorage.setItem('previewPreparePlan', this.form.content)
    },

    // 前往手动选题页面
    changeQuestions() {
      // 重置传递的试题的字段
      localStorage.removeItem('questionTypesSupply')

      // 将当前学生的试卷转成字符串传递过去
      const currentStudentPaperStr = JSON.stringify(this.questionToPaper)
      localStorage.setItem('questionTypesSupply', currentStudentPaperStr)

      // 重置返回的试题的字段
      localStorage.removeItem('questionTypesFeedback')

      // 打开一个新标签
      const url = `/prepare/myprepareplan/question?equal[grade_range_subject_id]=${this.form.grade_range_subject_id}`
      this.newWin = window.open(url, String(Date.now()), '', false)

      // 监听localStorage的变化
      window.addEventListener('storage', this.dealQuestionsStore)
    },

    // 监听回调函数
    dealQuestionsStore() {
      const questionTypesStr = localStorage.getItem('questionTypesFeedback')
      // 将题型中的题目过滤成一个数组
      const questionTypesJson = JSON.parse(questionTypesStr)

      // 如果监听到loaclstorage存在questionTypesFeedback项的话
      if (questionTypesJson) {
        // 关闭该标签
        this.newWin.close()

        // 添加到课堂练习试题列表中
        this.mergeQuestionTypes(questionTypesJson)

        // 回调成功后关闭这个监听
        window.removeEventListener('storage', this.dealQuestionsStore)
      }
    },

    // 将试卷转换为题目添加到试题列表中
    mergeQuestionTypes(questionTypesJson) {
      // 先map出旧的题目id组成的数组
      const oldQuestionsIds = this.form.questions.map(({ id }) => id)

      /**
       * 将试卷结构拆分成题目组成的数组
       * 编辑新数组，如果旧的题目里有该题，就不插入该题；如果没有，则插入该题
       */
      questionTypesJson
        .reduce((acc, type) => [...acc, ...type.questions], [])
        .forEach((question) => {
          if (!(oldQuestionsIds.includes(question.id))) {
            this.form.questions.push(question)
          }
        })
    },

    // 移除ppt
    remove(index) {
      this.form.attachments.splice(index, 1)
    },

    // 添加ppt
    add(response) {
      this.form.attachments.push({
        url: response.url,
        display_name: response.name,
      })
    },

    // 预览之前先检查后台是否上传成功
    beforePreview(url, name) {
      // 缓存当前的ppt链接
      this.ppt.url = url
      this.ppt.name = name
      this.pptCheck()
    },

    // 确认ppt状态接口
    pptCheck() {
      this.$http.post('/scheme/preview', {
        url: this.ppt.url,
      })
        .then((data) => {
          const { done, total } = data
          this.ppt.data = data

          // 如果已传文件等于总文件的话，表示可以预览,否则延时预览
          if (done === total) {
            this.ppt.visible = false
            this.pptPreview()
          } else if (data.fail) {
            this.$Message.error('文件错误，请尝试重新上传')
          } else {
            this.ppt.visible = true
            setTimeout(() => {
              this.pptCheck()
            }, 1500)
          }
        })
        .catch(({ message }) => {
          this.$Message.warning(message)
        })
    },

    // 打开新标签预览ppt
    pptPreview() {
      const win = window.open()
      win.location = this.ppt.url
    },

    // 提交表单（选题或者最终提交）
    submit() {
      this.formLoading = true

      if (this.step === 2) {
        // 如果是添加教案，则请求智能推题系统，否则直接读取接口中的数据
        if (this.isCreate) {
          this.getQuestionInfo()
        } else {
          this.nextStep()
          this.formLoading = false
        }
      } else {
        this.submitHandler()
      }
    },

    // 最终表单提交
    submitHandler() {
      if (this.isEdit) {
        this.$http.patch(`/scheme/${this.form.id}/edit`, this.form)
          .then(this.successHandler)
          .catch(this.errorHandler)
      } else {
        this.$http.post(`/scheme/${this.form.id}/create`, this.form)
          .then(this.successHandler)
          .catch(this.errorHandler)
      }
    },

    // 提交成功回调
    successHandler() {
      this.$Message.success('提交成功')
      this.formLoading = false
      this.closeModal()
      this.$emit('update')
    },

    // 智能推题
    getQuestionInfo() {
      // 如果已经推过，避免重复推送（卢）
      if (!this.hasQuestions) {
        this.questionLoading = true

        return this.$http.post('/scheme/intelligence', {
          id: this.form.id,
        })
          .then((res) => {
          // 推的题目人工去重
            const currentQuestionsIds = this.form.questions.map(({ id }) => id)
            res.forEach((question) => {
              if (!(currentQuestionsIds.includes(question.id))) {
                this.form.questions.push(question)
              } else {
              // console.log(question.id)
              }
            })

            this.formLoading = false
            if (this.step === 2) {
              this.nextStep()
            }
          })
          .catch(this.errorHandler)
          .then(() => {
            this.questionLoading = false
            this.hasQuestions = true
          })
      }

      this.formLoading = false
      if (this.step === 2) {
        this.nextStep()
      }
      return Promise.resolve()
    },

    // 关闭之前的再一次确认
    beforeCloseModal() {
      // 新增和编辑的文案不同
      const text = this.isCreate ? '取消后不会添加教案，当前录入的数据将不会保存，确定取消？' : '取消后教案将不保存任何更改，确定取消？'
      if (!this.isShow) {
        this.$Modal.confirm({
          title: '取消确认',
          content: `<div style="font-size:14px;text-align:left;fontt-weight:bold;">${text}</div>`,
          cancelText: '返回',
          okText: '确认',
          onOk: () => {
            this.closeModal()
          },
        })
      } else {
        this.closeModal()
      }
    },

    // 关闭弹窗
    closeModal() {
      this.$emit('closeEditModal')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
      this.step = 1
    },

    // 下一步之前做的判断
    beforeNextStep() {
      if (this.step === 1) {
        // 当他在编辑教案这一步骤
        if (this.form.content === '') {
          this.$Message.warning('请先添加教案')
        } else {
          this.nextStep()
        }
      } else if (this.step === 2) {
        // 当他在添加ppt这一步骤
        if (this.canAdd) {
          this.submit()
        } else {
          this.$Message.warning('请先完善PPT信息')
        }
      } else {
        this.nextStep()
      }
    },

    // 下一步
    nextStep() {
      this.formErrors = {}
      this.step = this.step + 1
    },

    // 上一步
    lastStep() {
      this.formErrors = {}
      this.step = this.step - 1
    },
  },
}
</script>

<style lang="less">
@import '~vars';

.prepareplan-edit-modal{
  &__header {
    margin-bottom: 30px;
  }

  &__wrap {
    min-height: 330px;
  }

  &__preview {
    margin-bottom: 15px;
    text-align: right;
  }

  &__alert {
    margin-top: 10px;
  }

  &__refresh{
    margin-bottom: 15px;
  }

  &__tips {
    margin-top: 8px;
  }
}
</style>
