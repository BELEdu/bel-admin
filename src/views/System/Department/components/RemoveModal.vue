<template>
  <!--根据该部门底下是否有子部门，分别显示无法删除或确认删除对话框-->
  <app-warn-modal
    :value="value"
    @input="updateValue"
    :title="title"
    :loading="formLoading"
    :prevent="hasChildren"
    action="删除"
    @on-ok="ok"
  >
    <!--无法删除-->
    <div slot="prevent" class="text-center">
      <p>该校区/部门存在关联的子部门</p>
      <p>请先删除关联的子部门后再重试</p>
    </div>
    <!--确认删除-->
    <div class="text-center">
      <p>删除校区或者部门后，将导致其关联的</p>
      <p>角色与用户均不可用，是否继续删除？</p>
    </div>

    <Form :model="form" :rule="rules" :label-width="90" :rules="rules" ref="form" v-if="isXiaoqu">
      <app-form-alert :errors="formErrors" :fullWidth="true"></app-form-alert>

      <Form-item label="请输入密码" prop="_checkout_password" style="margin-botto:10px;">
        <Input type="password" v-model="form._checkout_password"></Input>
      </Form-item>
    </Form>
  </app-warn-modal>
</template>

<script>
/**
 * 部门管理 - 删除部门弹框
 * @author lmh
 * @version 2017-07-13
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
    isTopLevel: {
      type: Boolean,
      required: true,
    },
    isXiaoqu: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      form: {
        _checkout_password: null,
      },

      rules: {
        _checkout_password: [
          this.$rules.required('密码'),
        ],
      },

      formLoading: false,
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
    value(value) {
      if (!value) {
        this.formErrors = {}
        this.$refs.form.resetFields()
      }
    },
  },

  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },

    ok() {
      if (this.isXiaoqu) {
        this.beforeSubmit()
      } else {
        this.submit()
      }
    },

    submit() {
      this.$store.dispatch(SYSTEM.DEPARTMENT.DELETE, this.item.id)
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    // 接口调用成功后的的处理
    successHandler() {
      this.formLoading = false
      this.$emit('input', false)
      this.$Message.info('操作成功')
    },
  },
}
</script>
