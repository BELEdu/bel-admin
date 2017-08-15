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
      <Form-item label="分配给" prop="relationships">
        <Select v-model="form.relationships" placeholder="请选择学管师...">
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
        relationships: null, // 学管师
        send_type: null, // 发送类型
      },

      manages: [],

      rules: {
        relationships: [
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
      this.$http.post('/student/do_assign_relationships', {
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
      this.$emit('closeManageModal')
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

