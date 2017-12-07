<template>
  <div class="prepareplan-edit-modal">
    <Modal
      :value="value"
      @input="value => $emit('input', value)"
      :title="title"
      :mask-closable="false"
      @on-cancel="closeModal"
      width="850"
    >

      <!-- 头部信息展示 -->
      <div class="prepareplan-edit-modal__header">

        <Steps
          :current="step-1"
          class="steps-fix"
          size="small"
        >
          <Step title="编辑教案"></Step>
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

          <!-- PPT网址 -->
          <div v-show="step === 2">
            <Form-item
              v-for="(ppt,index) in form.attachments"
              :key="index"
            >
              <Row>
                <Col :span="2" :offset="1" class="text-center">标题</Col>
                <Col :span="7">
                  <!-- PPT标题 -->
                  <Form-item>
                    <Input
                      v-model="ppt.display_name"
                      :readonly="isShow"
                      placeholder="请输入课件标题"
                    ></Input>
                  </Form-item>
                </Col>
                <Col :span="2" class="text-center">网址</Col>
                <Col :span="8">
                  <!-- PPT网址 -->
                  <Form-item>
                    <Input
                      v-model="ppt.url"
                      :readonly="isShow"
                      placeholder="请输入PPT发布程序上的链接"
                    ></Input>
                  </Form-item>
                </Col>
                <Col :span="1" :offset="1">
                  <Button
                    v-if="!isShow"
                    type="error"
                    @click="remove(index)"
                  >删除</Button>
                </Col>
              </Row>
            </Form-item>

            <!-- 添加按钮 -->
            <Row>
              <Col :span="17" :offset="3">
                <Button
                  class="prepareplan-edit-modal__add"
                  type="dashed"
                  long
                  v-if="!isShow"
                  :disabled="!canAdd"
                  @click="add"
                >添加</Button>
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

          <span v-if="isEmptyQuestion && step === 3 ">
            课堂练习题目不能为空
          </span>
        </p>

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

// 默认ppt数组项
const defaultPpt = {
  display_name: '',
  url: '',
}

export default {
  name: 'app-prepare-prepareplan-edit-modal',

  mixins: [form],

  components: {
    Question,
    QuestionList,
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

      questionLoading: false,

      localQuestion: null,

      newWin: null,

      editorFirstRender: false, // 是否第一次加载（用于加载编辑器静态文件）
      editorLoadOk: false, // 编辑器是否加载完毕
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
      localStorage.removeItem('prepareplanQuestions')
      const url = `/prepare/myprepareplan/question?equal[grade_range_subject_id]=${this.form.grade_range_subject_id}`
      // 打开一个新标签
      this.newWin = window.open(url, String(Date.now()), '', false)

      // 监听localStorage的变化
      window.addEventListener('storage', this.dealQuestionsStore)
    },

    // 监听回调函数
    dealQuestionsStore() {
      const questionsStr = localStorage.getItem('prepareplanQuestions')
      // 将题型中的题目过滤成一个数组
      const questionsJson = JSON.parse(questionsStr)
        .reduce((acc, type) => [...acc, ...type.questions], [])

      if (questionsJson) {
        this.newWin.close()
        // console.log(questionsJson)

        // 添加到课堂练习中
        this.form.questions = [
          ...this.form.questions,
          ...questionsJson,
        ]

        // 回调成功后关闭这个监听
        window.removeEventListener('storage', this.dealQuestionsStore)
      }
    },

    // 移除ppt
    remove(index) {
      this.form.attachments.splice(index, 1)
    },

    // 添加ppt
    add() {
      this.form.attachments.push({ ...defaultPpt })
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
      this.questionLoading = true

      return this.$http.post('/scheme/intelligence', {
        id: this.form.id,
      })
        .then((res) => {
          this.form.questions = [
            ...this.form.questions,
            ...res,
          ]

          this.formLoading = false
          if (this.step === 2) {
            this.nextStep()
          }
        })
        .catch(this.errorHandler)
        .then(() => {
          this.questionLoading = false
        })
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
      this.step = this.step + 1
    },

    // 上一步
    lastStep() {
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

  &__add {
    border-color: @primary-color;
    color: @primary-color;
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
