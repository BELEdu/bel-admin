<template>
  <app-form-modal
    :value="value"
    @input="value => $emit('input', value)"
    title="分配教师"
    :loading="formLoading"
    @on-ok="beforeSubmit()"
    @on-cancle="closeModal()"
  >
  <!--{{studentItem}}-->
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item label="分配给" prop="teacher_id">
        <Select v-model="form.teacher_id" placeholder="请选择...">
          <Option v-for="teacher in teachers" :key="teacher.value" :value="teacher.value">{{ teacher.display_name }}</Option>
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
        teacher_id: '',
        send_type: '',
      },

      teachers: [],

      rules: {
        teacher_id: [
          { required: true, type: 'number', message: '请选择教师', trigger: 'change' },
        ],
        send_type: [
          { required: true, type: 'number', message: '请选择通知方式', trigger: 'change' },
        ],
      },
    }
  },

  methods: {
    submit() {
      // 禁止连续点击
      this.formLoading = true
      // 用延时模拟请求成功
      this.$http.post('/student/do_assign_teacher', {
        ...this.form,
        student_item: this.studentItem,
      })
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    successHandler() {
      this.$Message.info('教师分配成功！')
      this.$emit('closeModalTeacher')
      this.closeModal()
    },

    closeModal() {
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
    },
  },

  created() {
    this.$http.get('/student/assign_teacher')
    .then((res) => {
      this.teachers = res
    })
  },
}
</script>

