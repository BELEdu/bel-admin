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
        <p>{{name}}</p>
      </div>

      <!-- 表单 -->
      <Form
        v-if="value"
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="0"
      >
        <app-form-alert :errors="formErrors"></app-form-alert>

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
            class="color-primary"
            type="dashed"
            shape="circle"
            icon="refresh"
            size="small"
            @click="refreshQuestion()"
          >换一批</Button>
        </div>

        <!-- 试题列表 -->
        <div v-for="(item,index) in questionList" :key="index">
          <question
            :index="index+1"
            :data="item"
            :width="500"
          /></question>

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
          v-show="!isReview && step === stepLength"
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
    ></question-analysis-dialog>

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
import qdata from './qdata'

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
    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    isReview: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      step: 1,
      stepLength: 2,

      questionList: qdata, // 试题假数据
      currentQuestion: {},
      modalActive: false,

      rules: {
        content: [
          this.$rules.required('教案详情'),
        ],
      },
    }
  },

  methods: {
    submit() {
      this.$Message.success('提交！')
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
        // 在这里用算法获取试题数据
        this.questionList = qdata
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

    // 打开解析弹窗
    openModal(index) {
      this.modalActive = true
      this.currentQuestion = this.questionList[index]
    },

    // 移除试题
    removeQuestion(index) {
      this.questionList.splice(index, 1)
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
