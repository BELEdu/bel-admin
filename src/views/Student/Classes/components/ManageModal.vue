<template>
  <app-form-modal
    :value="value"
    @input="value => $emit('input', value)"
    title="班级学员管理"
    :loading="formLoading"
    @on-ok="submit()"
    @on-cancle="closeModal()"
  >
   <Form ref="form" :model="form"  :label-width="70">
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item label="选择学员" >
        <Select v-model="form.students" placeholder="请选择学生..." multiple filterable>
          <Option v-for="item in studentData" :value="item.value" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
    </Form>
  </app-form-modal>
</template>
<script>
/**
 * 班级管理 - 快捷编辑学员
 * @author zml
 * @version 2017-06-29
 */
import { form } from '@/mixins'
// import { STUDENT } from '@/store/mutationTypes'
// import format from 'date-fns/format'

export default {
  name: 'app-student-classes-manage-modal',

  mixins: [form],

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    classId: {
      type: Number || String,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
    studentData: {
      type: Array,
      required: true,
    },
  },

  methods: {
    submit() {
      this.formLoading = true
      // this.$http.patch(`/classes/${this.classId}`, {
      //   ...this.form,
      //   start_at: this.form.start_at ? format(this.form.start_at, 'YYYY-MM-DD') : null,
      // })
      this.$http.patch(`/classes/${this.classId}`, this.form)
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    successHandler() {
      this.closeModal()
      this.$Message.info('提交成功！')
      this.$emit('update')
    },

    closeModal() {
      this.$emit('closeManageModal')
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
