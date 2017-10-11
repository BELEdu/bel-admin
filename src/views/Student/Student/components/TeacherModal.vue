<template>
  <app-form-modal
    :value="value"
    @input="value => $emit('input', value)"
    title="分配教师"
    :loading="formLoading"
    @on-ok="beforeSubmit"
    @on-cancel="closeModal"
  >
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item label="分配给" prop="teachers">
        <Select v-model="form.teachers" placeholder="请选择老师..." filterable multiple>
          <Option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.username }}</Option>
        </Select>
      </Form-item>
      <Form-item label="通知该教师" prop="send_type">
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
 * @version 2017-07-21
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
        teachers: [], // 教师多选
        send_type: null, // 发送类型
      },

      teachers: [],

      rules: {
        teachers: [
          this.$rules.required('分配教师', 'array', 'change'),
        ],
        send_type: [
          this.$rules.required('通知方式', 'number'),
        ],
      },
    }
  },

  methods: {
    submit() {
      this.$http.post('/student/do_assign_teacher', {
        ...this.form,
        student_item: this.studentItem,
      })
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    successHandler() {
      this.closeModal()
      this.$Message.info('提交成功！')
      // 这里或许可以不走接口请求
      this.$emit('update')
    },

    closeModal() {
      this.$emit('closeTeacherModal')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
    },
  },

  created() {
    // this.$http.get('/student/assign_teacher')
    this.$http.get('/teacher_list?attr=is_student_teac')
      .then((res) => {
        this.teachers = res
      })
  },
}
</script>

