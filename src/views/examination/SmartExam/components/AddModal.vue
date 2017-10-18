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
          v-if="value"
          ref="form"
          :model="form"
          :rules="rules"
          :label-width="80"
        >
          <app-form-alert :errors="formErrors"></app-form-alert>

          <Form-item label="测试对象" prop="id">
            <Select
              placeholder="请选择测试对象..."
              v-model="form.id"
            >
              <Option
                v-for="item in classData"
                :value="item.value"
                :key="item.value"
              >{{ item.display_name }}</Option>
            </Select>
          </Form-item>

          <Form-item label="课序" prop="id">
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

        </Form>

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
  name: 'app-prepare-prepareplan-edit-modal',

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
        id: null, // 测试对象（班级）
        order: null, // 课序
        duraction: 0, // 时长
      },

      rules: {

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
          display_name: '第一节课',
          value: 1,
        },
        {
          display_name: '第二节课',
          value: 2,
        },
        {
          display_name: '第三节课',
          value: 3,
        },
      ],

    }
  },

  methods: {
    submit() {
      this.$Message.success('提交！')
    },

    reset() {
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
      this.step = 1
    },

    closeModal() {
      this.$emit('closeAddModal')
      this.reset()
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
}
</style>
