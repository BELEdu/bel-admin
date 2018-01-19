<template>
  <AppFormModal
    :value="visible"
    @input="toggleModal"
    title="反馈"
    :width="434"
    :loading="formLoading"
    mask-closable
    @on-ok="beforeSubmit"
    @on-cancel="closeModal"
    class="reservation-modal"
  >
    <Form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="100"
      label-position="left"
    >
      <app-form-alert
        fullWidth
        :errors="formErrors"
      ></app-form-alert>

      <Form-item
        label="学员姓名"
        required
      >
        <span class="color-primary">{{form.student_name}}</span>
      </Form-item>

      <Form-item
        label="手机号码"
        required
      >
        <span class="color-primary">{{form.phone}}</span>
      </Form-item>

      <Form-item
        label="反馈类型"
        prop="reservation_operation"
      >
        <RadioGroup
         v-model="form.reservation_operation"
         type="button"
        >
          <Radio
            v-for="( operation , key ) in operationData"
            :key="key"
            :label="operation.value"
          >{{ operation.display_name }}</Radio>
        </RadioGroup>
      </Form-item>

      <!-- 科目预约时间 -->
      <Form-item
        v-if="visible && !isCancel"
        v-for="( subject, index ) in form.subjects"
        :key="index"
        :label="`科目：${subject.subject_name}`"
        :prop="`subjects.${index}.datetime`"
        :rules="[$rules.required('预约时间', 'string', 'change')]"
      >
        <app-date-picker
          v-model="subject.datetime"
          format="yyyy-MM-dd HH:mm"
          type="datetime"
          :options="datetimeOptions"
          placeholder="请选择预约时间"
        ></app-date-picker>
      </Form-item>

    </Form>

  </AppFormModal>
</template>

<script>
/**
 * 编辑反馈弹窗
 * @author zml
 * @version 2017-01-19
 */

import { form } from '@/mixins'

export default {
  name: 'reservation-modal',

  mixins: [form],

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
    },
    operationData: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      // 表单数据
      form: {
        id: null,
        reservation_operation: null,
        subjects: [],
      },

      // 表单校验规则
      rules: {
        reservation_operation: [
          this.$rules.required('预约类型', 'number', 'change'),
        ],
      },

      // 当天之前的日期不可选择
      datetimeOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        },
      },
    }
  },

  computed: {
    // 是否选择了取消预约
    isCancel() {
      return this.form.reservation_operation === 2
    },
  },

  watch: {
    visible(val) {
      if (val) {
        this.form = {
          ...this.form,
          ...this.data,
          reservation_operation: this.data.reservation_operation === 0 ?
            null : this.data.reservation_operation,
        }
      }
    },

    // 如果是取消预约，则清空预约时间
    isCancel(val) {
      if (val) {
        this.form.subjects
          .forEach(subject => this.$set(subject, 'datetime', ''))
      }
    },
  },

  methods: {

    // 监听弹窗的显示/隐藏
    toggleModal(val) {
      this.$emit('update:visible', val)
    },

    // 关闭弹窗
    closeModal() {
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
      this.$emit('update:visible', false)
    },

    // 提交表单
    submit() {
      this.$http.patch(`/reservation/${this.form.id}`, this.form)
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    // 提交成功回调
    successHandler() {
      this.formLoading = false
      this.$Message.success('提交成功！')
      this.$emit('update')
      this.closeModal()
    },
  },

}
</script>

<style lang="less">
@import '~vars';
.reservation-modal {
  .ivu-modal-body {
    padding: 25px 16px 16px 25px;
  }
}
</style>
