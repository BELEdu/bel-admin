<template>
  <app-form-modal
    :value="value"
    @input="value => $emit('input', value)"
    title="课时消耗"
    :width="390"
    :maskClosable="true"
    :loading="formLoading"
    @on-ok="beforeSubmit"
    @on-cancel="closeModal"
  >
     <Form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="90"
        v-if="value"
      >
        <app-form-alert
          fullWidth
          :errors="formErrors"
        ></app-form-alert>

        <Form-item label="上课时间" prop="created_at">
          <app-date-picker
            v-model="form.created_at"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="请选择上课时间"
          />
        </Form-item>

        <Form-item label="消耗课时数" required>
          <InputNumber
            v-model="form.used"
            :min="1"
            :step="1"
          />
        </Form-item>
      </Form>

  </app-form-modal>

</template>

<script>
/**
 * 课时消耗弹窗
 * @author zml
 * @version 2017-12-20
 */

import { form } from '@/mixins'

export default {
  name: 'student-adjust-modal',

  mixins: [form],

  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    id: {
      type: Number,
    },
  },

  data() {
    return {
      form: {
        used: 2, // 需要扣除的数量
        created_at: '', // 日期时间
      },

      rules: {
        created_at: [
          this.$rules.required('上课时间', 'string', 'change'),
        ],
      },
    }
  },

  methods: {
    // 表单提交
    submit() {
      this.$http.post(`/student/stock_adjust/${this.id}`, this.form)
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    // 提交成功回调
    successHandler() {
      this.$Message.success('提交成功！')
      this.$emit('update')
      this.closeModal()
    },

    // 关闭弹窗
    closeModal() {
      this.$emit('closeAdjustModal')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
    },
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
