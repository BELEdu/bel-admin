<template>
  <div class="prepareplan-edit-modal">
    <Modal
      :value="value"
      @input="value => $emit('input', value)"
      :title="title"
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
          <Step title="选择教案类型"></Step>
          <Step title="编辑教案"></Step>
          <Step title="课堂练习"></Step>
          <Step title="提交"></Step>
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

          <!-- 选择教案类型 -->
          <Form-item v-show="step === 1" class="prepareplan-edit-modal__radio">
            <RadioGroup
              v-model="prepareplanType"
              type="button"
              size="large"
            >
              <Radio :label="1" :disabled="isShow">录入课件</Radio>
              <Radio :label="2" :disabled="isShow">网址</Radio>
            </RadioGroup>
          </Form-item>

          <!-- 教案内容 -->
          <Form-item v-if="step === 2 && prepareplanType === 1">
            <app-editor
              :height="250"
              v-if="value"
              v-model="form.content"
            ></app-editor>
          </Form-item>

          <!-- 网址 -->
          <Form-item v-if="step === 2 && prepareplanType === 2 " class="prepareplan-edit-modal__url">
            <Input v-model="form.ppt_url" placeholder="请输入PPT课件网站"></Input>
          </Form-item>

        </div>

      </Form>

      <!-- 推荐试题 -->
      <div v-show="step === 3" class="prepareplan-edit-modal__question">
        <!-- 刷新按钮 -->
        <div class="right prepareplan-edit-modal__refresh">
          <Button
            v-if="!isShow"
            class="color-primary"
            type="dashed"
            shape="circle"
            icon="refresh"
            size="small"
            @click="getQuestionInfo()"
          >换一批</Button>
        </div>

        <!-- 试题列表 -->
        <div v-for="(item,index) in form.questions" :key="index">
          <question
            :index="index+1"
            :data="item"
            :width="500"
          ></question>

          <!-- 试题操作 -->
          <div class="prepareplan-edit-modal__action">
            <Button
              class="color-primary"
              type="dashed"
              shape="circle"
              icon="chatbox-working"
              size="small"
              @click="openModal(index)"
            >查看解析</Button>

            <Button
              v-if="!isShow"
              class="color-error right"
              type="text"
              shape="circle"
              icon="close"
              size="small"
              @click="removeQuestion(index)"
            ></Button>
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
          v-show="!isShow && step === stepLength"
          type="primary"
          size="large"
          :loading="formLoading"
          @click="submit"
        >提交</Button>

      </div>
    </Modal>

    <!-- 试题解析弹窗 -->
    <question-analysis-dialog
      :visible.sync="modalActive"
      :data="currentQuestion"
    >
      <span></span>
    </question-analysis-dialog>

  </div>
</template>

<script>
/**
 * 教案管理 - 添加 & 编辑 & 查看教案弹窗
 * @author zml
 * @version 2017-10-17
 */

import { form } from '@/mixins'
import { Question, QuestionAnalysisDialog } from '@/views/components'

export default {
  name: 'app-prepare-prepareplan-edit-modal',

  mixins: [form],

  components: {
    Question,
    QuestionAnalysisDialog,
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
      step: 1,
      stepLength: 3,

      currentQuestion: {},
      modalActive: false,

      // 教案类型 1.录入课件 2.网址
      prepareplanType: 1,
    }
  },

  computed: {
    title() {
      const text = `${this.form.classes_name} —— 第 ${this.form.sort_value} 节课`
      if (this.isCreate) {
        return `添加教案：${text}`
      } else if (this.isEdit) {
        return `编辑教案：${text}`
      }
      return `查看教案：${text}`
    },
  },

  watch: {
    'form.content': function formContent(val) {
      if (val === '') {
        this.prepareplanType = 2
      }
    },

    'form.ppt_url': function formContent(val) {
      if (val === '') {
        this.prepareplanType = 1
      }
    },
  },

  methods: {
    // 提交表单（选题或者最终提交）
    submit() {
      this.formLoading = true

      if (this.step === 2) {
        if (this.isCreate) {
          this.getQuestionInfo()
        } else {
          this.step = this.step + 1
          this.formLoading = false
        }
      } else {
        this.submitHandler()
      }
    },

    // 最终表单提交
    submitHandler() {
      if (this.isEdit) {
        this.$http.patch(`/scheme/${this.form.id}/edit`, {
          ...this.form,
          content: this.prepareplanType === 1 ? this.form.content : '',
          head_url: this.prepareplanType === 2 ? this.form.head_url : '',
        })
          .then(this.successHandler)
          .catch(this.errorHandler)
      } else {
        this.$http.post(`/scheme/${this.form.id}/create`, {
          ...this.form,
          content: this.prepareplanType === 1 ? this.form.content : '',
          head_url: this.prepareplanType === 2 ? this.form.head_url : '',
        })
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
      return this.$http.post('/scheme/intelligence')
        .then((res) => {
          this.form.questions = res
          this.formLoading = false
          if (this.step === 2) {
            this.step = this.step + 1
          }
        })
        .catch(this.errorHandler)
    },

    // 关闭弹窗
    closeModal() {
      this.$emit('closeEditModal')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
      this.step = 1
      this.prepareplanType = 1
    },

    // 下一步
    nextStep() {
      if (this.step === 2) {
        this.submit()
      } else {
        this.step = this.step + 1
      }
    },

    // 上一步
    lastStep() {
      this.step = this.step - 1
    },

    // 打开解析弹窗
    openModal(index) {
      this.modalActive = true
      this.currentQuestion = this.form.questions[index]
    },

    // 移除试题
    removeQuestion(index) {
      this.form.questions.splice(index, 1)
    },

    // 换一批试题
    refreshQuestion() {
      this.$Message.success('换一批')
    },
  },
}
</script>

<style lang="less">
.prepareplan-edit-modal{
  &__header {
    margin-bottom: 30px;
  }

  &__wrap {
    min-height: 330px;
  }

  &__radio {
    text-align: center;
    padding-top: 130px;

    .ivu-radio-group-item {
      min-width: 100px;
    }
  }

  &__url {
    padding: 130px 80px;
  }

  &__refresh{
    margin-bottom: 15px;
  }

  &__question {
    width: 500px;
    margin:auto;
  }

  &__action {
    margin:12px auto;
  }
}
</style>
