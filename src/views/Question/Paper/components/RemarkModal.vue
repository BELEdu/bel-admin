<template>
  <app-form-modal
    :value="value"
    @input="value => $emit('input', value)"
    :title="title"
    :maskClosable="true"
    :loading="formLoading"
    @on-ok="beforeSubmit"
    @on-cancel="closeModal"
    class="remark-modal"
  >
    <!-- 表单 -->
    <Form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="90"
    >
      <app-form-alert :errors="formErrors"></app-form-alert>

      <Form-item
        label="配置类型"
        prop="dimension"
      >
        <Select
          v-model="form.dimension"
          :disabled="isEdit"
          filterable
          placeholder="请选择配置类型"
        >
          <Option
            v-for="item in types"
            :value="item.value"
            :key="item.display_name"
          >{{ item.display_name }}</Option>
        </Select>
      </Form-item>

      <Form-item
        v-if="currentDimension"
        label="配置子类型"
        prop="sub_dimension"
      >
        <Select
          v-model="form.sub_dimension"
          :key="form.sub_dimension"
          :disabled="isEdit"
          filterable
          placeholder="请选择配置子类型"
        >
          <Option
            v-for="item in childrenData"
            :value="item.value"
            :key="item.display_name"
          >{{ item.display_name }}</Option>
        </Select>
      </Form-item>

      <Form-item
        v-if="currentDimension"
        label="匹配类型"
        required
      >
        <div class="color-primary">
          <span v-if="matchType === 1">百分比范围</span>
          <span v-if="matchType === 2">数值范围</span>
        </div>
      </Form-item>

      <Form-item
        v-if="currentDimension"
        label="匹配值"
        required
      >
        <InputNumber
          :max="limit"
          :min="0"
          v-model="form.match_start"
        ></InputNumber>
        <b v-if="matchType === 1" class="color-success remark-modal__percent">%</b>

        <Icon type="minus" class="color-primary remark-modal__line"></Icon>

        <InputNumber
          :max="limit"
          :min="0"
          v-model="form.match_end"
        ></InputNumber>
        <b v-if="matchType === 1" class="color-success remark-modal__percent">%</b>

        <p class="color-error" v-if="isWrong">初始值不能大于最终值</p>

      </Form-item>

      <Form-item
        label="评语"
        prop="description"
      >
        <Input
        v-model="form.description"
        type="textarea"
        :autosize="{minRows: 5,maxRows: 8}"
        placeholder="请输入评语..."></Input>
      </Form-item>

    </Form>
  </app-form-modal>
</template>

<script>
/**
 * 添加/编辑评语弹窗
 * @author zml
 * @version 2017-11-14
 */

import { form } from '@/mixins'

export default {
  name: 'remark-modal',

  mixins: [form],

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    remarkId: {},
    form: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    types: {
      type: Array,
      required: true,
    },
  },


  data() {
    return {
      rules: {
        dimension: [
          this.$rules.required('配置类型', 'number', 'change'),
        ],
        sub_dimension: [
          this.$rules.required('配置子类型', 'number', 'change'),
        ],
        description: [
          this.$rules.required('评语'),
        ],
      },
    }
  },

  computed: {
    title() { // 弹窗标题
      return this.isEdit ? '编辑评语' : '添加评语'
    },

    currentDimension() { // 当前选择的配置类型value
      return this.form.dimension
    },

    matchType() { // 匹配类型 1.百分比范围 2.数值范围
      if (this.currentDimension) {
        return this.types.find(type => type.value === this.currentDimension).match_type
      }
      return null
    },

    childrenData() { // 配置子类型数据源
      if (this.currentDimension) {
        return this.types.find(type => type.value === this.currentDimension).childrens
      }
      return null
    },

    limit() { // 根据匹配类型不同而限制最大值
      if (this.matchType === 1) {
        return 100
      }
      return 999
    },

    isWrong() { // 匹配值
      return this.form.match_start > this.form.match_end
    },
  },

  watch: {
    // （新增评语时）当配置类型变化的时候，重置部分表单
    currentDimension() {
      if (!this.isEdit) {
        this.form.sub_dimension = null
        this.form.match_start = 0
        this.form.match_end = 0
      }
    },

    // 当匹配类型变化的时候，主动把值赋给表单
    matchType(val) {
      this.form.match_type = val
    },
  },

  methods: {
    // 提交表单
    submit() {
      if (this.isWrong) {
        this.$Message.error('初始值不能大于最终值！')
      } else if (this.isEdit) {
        this.$http.patch(`/paper/${this.id}/refer/${this.remarkId}`, this.form)
          .then(this.successHandler)
          .catch(this.errorHandler)
      } else {
        this.$http.post(`/paper/${this.id}/refer`, this.form)
          .then(this.successHandler)
          .catch(this.errorHandler)
      }
    },

    // 提交成功回调
    successHandler() {
      this.closeModal()
      this.$Message.success('提交成功！')
      this.$emit('update')
    },

    // 关闭窗口
    closeModal() {
      this.$emit('closeRemarkModal')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
    },
  },
}
</script>

<style lang="less">
@import '~vars';

.remark-modal {
  &__line {
    margin: 0 15px;
  }

  &__percent {
    margin-left: 2px;
    font-size: 15px;
  }

}
</style>
