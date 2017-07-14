<template>
  <app-form-modal
    :value="value"
    @input="value => $emit('input', value)"
    :title="`解决预警信息 ID:${warningId}`"
    :loading="formLoading"
    @on-ok="beforeSubmit"
    @on-cancle="closeModal"
  >
   <Form ref="form" :model="form" :rules="rules" :label-width="70">
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item label="解决说明" prop="warning_reason">
        <Input v-model="form.warning_reason" type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="请输入..."></Input>
      </Form-item>
    </Form>
  </app-form-modal>
</template>

<script>
/**
 * 学员管理 - 解决预警信息弹窗
 * @author zml
 * @version 2017-07-14
 */
import { form } from '@/mixins'

export default {
  name: 'app-student-warning-ok-modal',

  mixins: [form],

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    warningId: {
      type: Number || String,
      required: true,
    },
    warningStatus: {
      type: Number || String,
      required: true,
    },
  },

  data() {
    return {
      form: {
        warning_reason: '',
      },

      rules: {
        warning_reason: [
          this.$rules.required('解决说明'),
          this.$rules.max(500),
        ],
      },
    }
  },

  methods: {
    submit() {
      this.$http.post(`/studentwarning/resolve/${this.warningId}`, {
        ...this.form,
        id: this.warningId,
        warning_status: this.warningStatus,
      })
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    successHandler() {
      this.closeModal()
      this.$Message.info('提交成功！')
      this.$emit('updateData')
    },

    closeModal() {
      this.$emit('closeWarningOkModal')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
    },
  },

}
</script>

<style>
@import '~vars';
</style>
