<template>
  <div>
    <!--新增与更名对话框-->
    <app-form-modal
      :value="modal.form"
      @input="value => updateModal(value, 'form')"
      :title="title"
      :loading="formLoading"
      @on-ok="ok"
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

    <!--根据该部门底下是否有子部门，分别显示无法删除或确认删除对话框-->
    <app-warn-modal
      :value="modal.remove"
       @input="value => updateModal(value, 'remove')"
      :title="hasChildren ? '无法删除' : '删除确认'"
      :loading="formLoading"
      :prevent="hasChildren"
      action="删除"
      @on-ok="remove"
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

      <Form :model="delForm" :rule="rules" :label-width="90" :rules="rules" ref="delForm" v-if="isXiaoqu" style="margin-top:20px;">
        <app-form-alert :errors="formErrors" :fullWidth="true"></app-form-alert>

        <Form-item label="请输入密码" prop="_checkout_password" style="margin-botto:10px;">
          <Input type="password" v-model="delForm._checkout_password"></Input>
        </Form-item>
      </Form>
    </app-warn-modal>
  </div>
</template>

<script>
/**
 * 系统管理 - 部门管理 - 条目操作
 * @author lmh
 * @version 2017-07-07
 */

import store from '@/store'
import { SYSTEM } from '@/store/mutationTypes'
import { form } from '@/mixins'

export default {
  mixins: [form],

  props: {
    item: {
      type: Object,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
    modal: {
      type: Object,
      required: true,
    },
    isCreate: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
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

      delForm: {
        _checkout_password: '',
      },
    }
  },

  computed: {
    hasChildren() {
      return this.item.children && this.item.children.length > 0
    },

    title() {
      switch (this.item.level) {
        case 1:
          return this.isCreate ? '新增校区' : '公司更名'
        case 2:
          return this.isCreate ? '新增子部门' : '校区更名'
        default:
          return this.isCreate ? '新增子部门' : '部门名称'
      }
    },

    label() {
      switch (this.item.level) {
        case 1:
          return this.isCreate ? '校区名称' : '公司名称'
        case 2:
          return this.isCreate ? '部门名称' : '校区名称'
        default:
          return '部门名称'
      }
    },

    isXiaoqu() {
      const { item: { level } } = this
      return ((level === 1 && this.isCreate) || (level === 2 && !this.isCreate))
    },

    data() {
      // 如果是新增或更名的是校区，提交时应重新拼接上校区二字
      if (this.isXiaoqu) {
        return {
          ...this.form,
          display_name: `${this.form.display_name}校区`,
        }
      }
      return this.form
    },
  },

  methods: {
    // 关闭模态框的时候清理表单数据
    updateModal(value, type) {
      this.modal[type] = value
      this.formErrors = {}
      this.delForm = {
        _checkout_password: '',
      }
      this.$refs.form.$el.reset()
    },

    // 表单判断是新增还是更名
    ok() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            this.create()
          } else {
            this.update()
          }
        }
      })
    },

    // 新增
    create() {
      this.formLoading = true
      store.dispatch(SYSTEM.DEPARTMENT.CREATE, {
        ...this.data,
        p_id: this.item.id,
      })
        .then(() => this.successHandler('form'))
        .catch(this.errorHandler)
    },

    // 更名
    update() {
      this.formLoading = true
      const { id, p_id } = this.item
      store.dispatch(SYSTEM.DEPARTMENT.UPDATE, {
        id,
        data: {
          ...this.data,
          p_id,
        },
      })
        .then(() => this.successHandler('form'))
    },

    beforeRemove() {
      if (this.isXiqoqu) {
        this.$refs.delForm.validate((valid) => {
          if (valid) {
            this.remove()
          }
        })
      } else {
        this.remove()
      }
    },

    // 删除
    remove() {
      this.formLoading = true
      const { id } = this.item
      store.dispatch(SYSTEM.DEPARTMENT.DELETE, id)
        .then(() => this.successHandler('remove'))
    },

    // 接口调用成功后的的处理
    successHandler(type) {
      this.formLoading = false
      this.$emit('closeModal', type)
      this.$Message.info('操作成功')
    },
  },
}
</script>
