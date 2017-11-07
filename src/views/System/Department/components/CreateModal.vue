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
      <Form-item v-if="isCreate && isXiaoqu" label="请输入密码" prop="password">
        <Input type="password" v-model="form.password"></Input>
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

import { mapState } from 'vuex'
import { SYSTEM } from '@/store/mutationTypes'
import { form } from '@/mixins'

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
    isCreate: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      form: {
        display_name: '',
        password: null,
      },

      rules: {
        display_name: [
          this.$rules.required('名称'),
          this.$rules.length(2, 16),
          {
            validator: (rule, value, next) => {
              const { children } = this.departments[0]
              if (children) {
                const isDuplicatedName = children
                  .filter(item => item !== this.item)
                  .some(item => item.display_name.slice(0, -2) === value)
                if (isDuplicatedName) {
                  next(new Error('校区名称不能重复'))
                } else {
                  next()
                }
              } else {
                next()
              }
            },
            trigger: 'blur',
          },
        ],
        password: [
          this.$rules.required('密码'),
        ],
      },
    }
  },

  computed: {
    ...mapState({
      departments: state => state.system.department.departments,
    }),

    isTopLevel() {
      return this.item.p_id === 0
    },

    isXiaoqu() {
      const { display_name } = this.item
      const hasText = display_name != null && display_name.slice(-2) === '校区'
      // 新增时，第一级为新增校区；非新增时，名字中含有“校区”的为校区
      return (this.isCreate && this.isTopLevel) || (!this.isCreate && hasText)
    },

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
        this.$refs.form.resetFields()
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
      const { display_name, password: CheckoutPassword } = this.data
      this.$store.dispatch(SYSTEM.DEPARTMENT.CREATE, {
        data: {
          display_name,
          p_id: this.item.id,
        },
        CheckoutPassword,
      })
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    // 更名
    update() {
      this.$store.dispatch(SYSTEM.DEPARTMENT.UPDATE, {
        id: this.item.id,
        data: { display_name: this.data.display_name },
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
