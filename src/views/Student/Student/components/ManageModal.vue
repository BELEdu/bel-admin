<template>
  <app-form-modal
    :value="value"
    @input="value => $emit('input', value)"
    title="分配学管师"
    :loading="formLoading"
    @on-ok="beforeSubmit"
    @on-cancle="closeModal"
  >
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item label="分配给" prop="manage_id">
        <Select v-model="form.manage_id" placeholder="请选择...">
          <Option v-for="manage in manages" :key="manage.id" :value="manage.id">{{ manage.username }}</Option>
        </Select>
      </Form-item>
      <Form-item label="通知该学管师" prop="send_type">
        <Radio-group v-model="form.send_type">
          <Radio :label="1">发送短信</Radio>
          <Radio :label="2">发送邮件</Radio>
        </Radio-group>
      </Form-item>
    </Form>
  </app-form-modal>
</template>

<script>
/**
 * 学员分配教师组件
 * @author  zhoumenglin
 * @version 2017-07-10
 */

import { form } from '@/mixins'

export default {
  mixins: [form],

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    studentItem: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      form: {
        teacher_id: null,
        send_type: null,
      },

      manages: [],

      rules: {
        manage_id: [
          this.$rules.required('分配学管师', 'number'),
        ],
        send_type: [
          this.$rules.required('通知方式', 'number'),
        ],
      },
    }
  },

  methods: {
    submit() {
      // 等分配学管师接口替换
      this.$http.post('/student/do_assign_manage', {
        ...this.form,
        student_item: this.studentItem,
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
      this.$emit('closeTeacherModal')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
    },
  },

  created() {
    this.$http.get('/teacher_list?attr=is_student_admin')
    .then((res) => {
      this.manages = res
    })
  },
}
</script>

