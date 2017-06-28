<template>
  <app-form-modal
    :value="value"
    @input="value => $emit('input', value)"
    title="分配教师"
    :loading="loading"
    @on-ok="submit()"
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

export default {
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

      loading: false,

      rules: {
        teacher_id: [
          { required: true, type: 'number', message: '请选择教师', trigger: 'change' },
        ],
        send_type: [
          { required: true, type: 'number', message: '请选择通知方式', trigger: 'change' },
        ],
      },

      formErrors: {},
    }
  },

  methods: {
    submit() {
      // 验证表单
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 禁止连续点击
          this.loading = true
          // 用延时模拟请求成功
          this.$http.post('/student/do_assign_teacher', {
            ...this.form,
            student_item: this.studentItem,
          })
            .then(this.successHandler)
              .catch(this.errorHandler)
        }
      })
    },

    successHandler() {
      this.$Message.info('教师分配成功！')
      this.$emit('closeModalTeacher')
      this.closeModal()
    },

    errorHandler({ errors }) {
      if (errors) {
        this.formErrors = errors
        this.loading = false
      } else {
        this.formErrors = { error: ['服务端错误，请稍后重试'] }
        this.loading = false
      }
    },

    closeModal() {
      // console.log('关闭')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.loading = false
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

