<template>
  <Date-picker 
    :type="type"
    :value="dateVal"
    :format="format"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :editable="editable"
    :open="$attrs.open"
    :confirm="$attrs.confirm"
    :options="options"
    @on-change="onChange"
    @on-open-change="onOpenChange"
    @on-ok="onOk"
    @on-clear="onClear"
  >
    <slot></slot>
  </Date-picker>
</template>
<script>
  /**
   * 日期选择器
   * @author    chenliangshan
   * @version   2017/07/20
   */

  export default {
    name: 'app-date-picker',
    data() {
      return {
        dateVal: this.value,
        cycle: 0,
      }
    },
    props: {
      type: {
        type: String,
        default: 'date',
      },
      // 设置输出类型
      dateType: {
        type: String,
        default: 'string',
      },
      value: [String, Array, Date],
      format: {
        type: String,
        default: 'yyyy-MM-dd',
      },
      placeholder: {
        type: String,
        default: '',
      },
      size: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      editable: {
        type: Boolean,
        default: false,
      },
      options: Object,
    },
    computed: {
      formItem() {
        return this.getParentCom('FormItem')
      },
      form() {
        return this.getParentCom('iForm')
      },
    },
    watch: {
      value(val) {
        this.dateVal = val
      },
      dateVal(val) {
        return this.$emit('input', val)
      },
    },
    methods: {
      onChange(val) {
        let date = val

        if ((!val || !val[0]) && this.formItem.prop && this.getFormRequired()) {
          this.formItem.validate('', (valid) => {
            this.$emit('on-validate', valid)
          })
        }
  
        // 处理日期范围为空时的情况
        if (typeof val === 'object' && !val[0]) {
          date = []
        }

        this.$emit('input', date)
        this.$emit('on-change', val)
      },
      onOpenChange() {
        this.$emit('on-open-change')
      },
      onOk() {
        this.$emit('on-ok')
      },
      onClear() {
        this.$emit('on-clear')
      },
      // 获取父级组件
      getParentCom(componentName) {
        let parent = this.$parent
        while (parent.$options.name !== componentName) {
          parent = parent.$parent
        }
        return parent
      },
      // 获取该组件value字段是否必填
      getFormRequired() {
        const rules = this.formItem.getRules()
        return rules.map(item => item.required).indexOf(true) > -1
      },
    },
  }
</script>
