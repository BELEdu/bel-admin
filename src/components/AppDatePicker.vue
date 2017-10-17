<template>
  <Date-picker :type="type"
               v-model="dateVal"
               :format="format"
               :placeholder="placeholder"
               :disabled="disabled"
               :readonly="readonly"
               :editable="editable"
               :open="$attrs.open"
               :confirm="$attrs.confirm"
               @on-change="onChange"
               @on-open-change="onOpenChange"
               @on-ok="onOk"
               @on-clear="onClear">
    <slot></slot>
  </Date-picker>
</template>
<script>
  /**
   * 日期选择器
   * @author    chenliangshan
   * @version   2017/07/20
   */

  import { formatDate } from '@/utils/date'
  import isEqual from 'lodash/isEqual'

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
      dateVal(val, oldVal) {
        if (val && !isEqual(val, oldVal) &&
          (Object.prototype.toString.call(val) === '[object Date]' ||
            (Object.prototype.toString.call(val) === '[object Array]' &&
              Object.prototype.toString.call(val[0]) === '[object Date]'))) {
          return this.dateFormat(val)
        }
        return this.$emit('input', val)
      },
    },
    methods: {
      getParentCom(componentName) {
        let parent = this.$parent
        while (parent.$options.name !== componentName) {
          parent = parent.$parent
        }
        return parent
      },
      onChange(val) {
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
      // 获取该组件value字段是否必填
      getFormRequired() {
        const rules = this.formItem.getRules()
        return rules.map(item => item.required).indexOf(true) > -1
      },
      // 日期格式转换
      dateFormat(val) {
        let date = val
        if (this.dateType === 'string') {
          date = formatDate(date, this.format)
        } else if (this.dateType === 'daterange') {
          date = [formatDate(date[0], this.format), formatDate(date[1], this.format)]
        } else if (this.dateType === 'date' && typeof date === 'string') {
          date = new Date(date)
        }

        if (date && this.formItem.prop && this.getFormRequired()) {
          this.formItem.validate('', (valid) => {
            this.$emit('on-validate', valid)
          })
        }

        this.$emit('input', date)
      },
    },
  }
</script>
