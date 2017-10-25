<template>
  <div class="prepareplan-edit-modal">
    <Modal
      :value="value"
      @input="value => $emit('input', value)"
      :title="title"
      @on-cancel="closeModal"
      width="600"
    >
      <!-- 头部信息展示 -->
      <div class="text-center prepareplan-edit-modal__header">

        <p>
          <strong>{{step}}</strong> Of <strong>{{stepLength}}</strong>
        </p>
        <p class="color-primary">{{form.classes_name}} —— 第{{form.sort_value}}节课</p>
      </div>

      <!-- 表单 -->
      <Form
        v-if="value"
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="0"
      >
        <app-form-alert
          :errors="formErrors"
          fullWidth
        ></app-form-alert>

        <!-- 教案内容 -->
        <Form-item v-show="step === 1" prop="content">
          <app-editor
            :height="250"
            v-if="value"
            v-model="form.content"
          ></app-editor>
        </Form-item>

      </Form>

      <!-- 推荐试题 -->
      <div v-show="step === 2" class="prepareplan-edit-modal__question">
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
          @click="beforeSubmit"
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
      stepLength: 2,

      currentQuestion: {},
      modalActive: false,

      rules: {
        content: [
          this.$rules.required('教案详情'),
        ],
      },
    }
  },

  computed: {
    title() {
      if (this.isCreate) {
        return '添加教案'
      } else if (this.isEdit) {
        return '编辑教案'
      }
      return '查看教案'
    },
  },

  methods: {
    submit() {
      if (this.step === 1) {
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
          if (this.step === 1) {
            this.step = this.step + 1
          }
        })
        .catch(this.errorHandler)
      // this.step = this.step + 1
      // this.formLoading = false
      // this.$Message.success('获取习题')
    },

    closeModal() {
      this.$emit('closeEditModal')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
      this.step = 1
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
    p {
      margin-bottom: 16px;
    }
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
