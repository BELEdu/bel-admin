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
          <Step title="编辑教案"></Step>
          <Step title="PPT"></Step>
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

          <!-- 教案内容 -->
          <Form-item v-show="step === 1">
            <app-editor
              :height="250"
              v-if="value"
              v-model="form.content"
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
                    <Input v-model="ppt.url" placeholder="请输入课件标题"></Input>
                  </Form-item>
                </Col>
                <Col :span="2" class="text-center">网址</Col>
                <Col :span="8">
                  <!-- PPT网址 -->
                  <Form-item>
                    <Input v-model="ppt.display_name" placeholder="请输入PPT课件网址，例如： www.ppj.io"></Input>
                  </Form-item>
                </Col>
                <Col :span="1" :offset="1">
                  <Button
                    v-if="form.attachments.length >1"
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
                  :disabled="!canAdd"
                  @click="add"
                >添加</Button>
              </Col>
            </Row>

          </div>

        </div>
        <!-- 表单区域结束 -->

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
          @click="beforeNextStep"
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
  },

  methods: {
    // 移除ppt
    remove(index) {
      this.form.attachments.splice(index, 1)
    },

    // 添加ppt
    add() {
      this.form.attachments.push(defaultPpt)
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
      return this.$http.post('/scheme/intelligence')
        .then((res) => {
          this.form.questions = res
          this.formLoading = false
          if (this.step === 2) {
            this.nextStep()
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
        // 当他在编辑教案这一步骤
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
@import '~vars';

.prepareplan-edit-modal{
  &__header {
    margin-bottom: 30px;
  }

  &__wrap {
    min-height: 330px;
  }

  &__add {
    border-color: @primary-color;
    color: @primary-color;
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
