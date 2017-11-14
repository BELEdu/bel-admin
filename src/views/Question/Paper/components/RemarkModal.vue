<template>
 <app-form-modal
    :value="value"
    @input="value => $emit('input', value)"
    :title="title"
    :maskClosable="true"
    :loading="formLoading"
    @on-ok="submit"
    @on-cancel="closeModal"
  >
   <!-- 表单 -->
    <Form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="80"
    >
    </Form>
    编辑弹窗
  </app-form-modal>
</template>

<script>
/**
 * 添加/编辑评语弹窗
 * @author zml
 * @version 2017-11-14
 */

import { form } from '@/mixins'

export default {
  name: 'remark-modal',

  mixins: [form],

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
  },


  data() {
    return {

      form: {

      },


      rules: {

      },
    }
  },

  computed: {
    title() {
      return this.isEdit ? '编辑评语' : '添加评语'
    },
  },

  methods: {
    // 提交表单
    submit() {
      this.$Message.success('提交成功！')
      this.closeModal()
    },

    // 关闭窗口
    closeModal() {
      this.$emit('closeRemarkModal')
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
