<template>
  <!--根据该部门底下是否有子部门，分别显示无法删除或确认删除对话框-->
  <app-warn-modal
    :value="value" @input="updateValue"
    :title="title" action="删除"
    :loading="formLoading"
    :prevent="hasChildren"
    @on-ok="beforeSubmit"
  >
    <!--无法删除-->
    <div slot="prevent" class="text-center">
      <p>该校区/部门存在关联的子部门</p>
      <p>请先删除关联的子部门后再重试</p>
    </div>

    <!--确认删除-->
    <Form :model="form" :rules="rules" ref="form">
      <app-form-alert :errors="formErrors"></app-form-alert>
      <div class="text-center" style="margin: -10px 0 10px;">
        <p>删除校区或者部门后，将导致其关联的</p>
        <p>角色与用户均不可用，是否继续删除？</p>
      </div>
      <Form-item prop="password">
        <Input type="password" placeholder="请输入密码" v-model="form.password"></Input>
      </Form-item>
    </Form>
  </app-warn-modal>
</template>

<script>
/**
 * 部门管理 - 删除部门弹框
 * @author lmh
 * @version 2017-07-14
 */

import { SYSTEM } from '@/store/mutationTypes'
import { form } from '@/mixins'

export default {
  name: 'app-system-department-remove',

  mixins: [form],

  props: {
    item: {
      type: Object,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      form: {
        password: null,
      },

      rules: {
        password: [
          this.$rules.required('密码'),
        ],
      },
    }
  },

  computed: {
    hasChildren() {
      return this.item.children && this.item.children.length > 0
    },

    title() {
      return this.hasChildren ? '无法删除' : '删除确认'
    },
  },

  watch: {
    value() {
      this.formErrors = {}
      this.$refs.form.resetFields()
    },
  },

  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },

    submit() {
      this.$store.dispatch(SYSTEM.DEPARTMENT.DELETE, {
        id: this.item.id,
        CheckoutPassword: this.form.password,
      })
        .then(() => {
          this.formLoading = false
          this.$emit('input', false)
          this.$Message.info('操作成功')
        })
        .catch(this.errorHandler)
    },
  },
}
</script>
