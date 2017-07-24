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

  export default {
    name: 'app-date-picker',
    data() {
      return {
        dateVal: null,
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
      value: [String, Date],
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
    created() {
      this.dateVal = this.value
    },
    computed: {
      formItem() {
        let parent = this.$parent
        while (parent.$options.name !== 'FormItem') {
          parent = parent.$parent
        }
        return parent
      },
    },
    methods: {
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
      // 日期格式转换
      dateFormat(val) {
        let date = val || ''
        if (date) {
          if (this.dateType === 'string' && Object.prototype.toString.call(date) === '[object Date]' && (formatDate(date, this.format) !== this.value || !this.cycle)) {
            date = date ? formatDate(date, this.format) : ''
          } else if (this.dateType === 'date' && (date !== this.value || !this.cycle || typeof date === 'string')) {
            date = new Date(date)
          }
          // 初始周期结束
          if (!this.cycle) this.cycle = 1
        }
        this.$emit('input', date || null)
      },
    },
    watch: {
      value(val) {
        this.dateVal = val
      },
      dateVal(val) {
        let date = val
        if (val) {
          this.dateFormat(val)
        } else if (!this.formItem.prop) {
          date = null
        } else {
          date = ''
        }
        this.$emit('input', date)
      },
    },
  }
</script>
