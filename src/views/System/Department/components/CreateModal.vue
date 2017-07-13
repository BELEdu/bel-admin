<template>
  <app-form-modal
    :value="value"
    @input="updateValue"
    :title="title"
    :loading="formLoading"
    @on-ok="beforeSubmit"
  >
    <Form :model="form" :rules="rules" :label-width="90" ref="form">
      <app-form-alert :errors="formErrors" :fullWidth="true"></app-form-alert>

      <Form-item :label="label" prop="display_name">
        <!--这里要判断是否显示校区二字-->
        <Input v-show="isXiaoqu" v-model="form.display_name">
          <span slot="append">校区</span>
        </Input>
        <Input v-show="!isXiaoqu" v-model="form.display_name"></Input>
      </Form-item>
      <Form-item v-if="isXiaoqu" label="请输入密码" prop="_checkout_password">
        <Input type="password" v-model="form._checkout_password"></Input>
      </Form-item>
    </Form>
  </app-form-modal>
</template>

<script>
/**
 * 部门管理 - 新建/更新部门弹框
 * @author lmh
 * @version 2017-07-13
 */

import { SYSTEM } from '@/store/mutationTypes'
import { form } from '@/mixins'

const formData = {
  display_name: '',
  _checkout_password: null,
}

export default {
  name: 'app-system-department-create',

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
    isCreate: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      form: { ...formData },

      rules: {
        display_name: [
          this.$rules.required('名称'),
          this.$rules.length(2, 16),
        ],
        _checkout_password: [
          this.$rules.required('密码'),
        ],
      },

      formLoading: false,
    }
  },

  computed: {
    title() {
      if (this.isTopLevel) {
        return this.isCreate ? '新增校区' : '公司更名'
      } else if (this.isXiaoqu) {
        return this.isCreate ? '新增子部门' : '校区更名'
      }
      return this.isCreate ? '新增子部门' : '部门名称'
    },

    label() {
      if (this.isTopLevel) {
        return this.isCreate ? '校区名称' : '公司名称'
      } else if (this.isXiaoqu) {
        return this.isCreate ? '部门名称' : '校区名称'
      }
      return '部门名称'
    },

    // 如果是新增或更名的是校区，提交时应重新拼接上校区二字
    data() {
      const { display_name } = this.form
      return {
        ...this.form,
        display_name: this.isXiaoqu ? `${display_name}校区` : display_name,
      }
    },
  },

  watch: {
    value(newValue) {
      if (newValue) {
        if (!this.isCreate) {
          this.form.display_name = this.item.display_name.replace('校区', '')
        }
      } else {
        this.formErrors = {}
        this.form = { ...formData }
      }
    },
  },

  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },

    // 表单判断是新增还是更名
    submit() {
      if (this.isCreate) {
        this.create()
      } else {
        this.update()
      }
    },

    // 新增
    create() {
      this.formLoading = true
      this.$store.dispatch(SYSTEM.DEPARTMENT.CREATE, {
        ...this.data,
        p_id: this.item.id,
      })
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    // 更名
    update() {
      this.formLoading = true
      const { id, p_id } = this.item
      this.$store.dispatch(SYSTEM.DEPARTMENT.UPDATE, {
        id,
        data: { ...this.data, p_id },
      })
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
