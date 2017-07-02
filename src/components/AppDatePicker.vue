<template>
  <Date-picker :type="type"
               v-model="dateVal"
               :format="format"
               :placeholder="placeholder"
               :disabled="disabled"
               :readonly="readonly"
               @on-change="onChange"
               @on-open-change="onOpenChange"
               @on-ok="onOk"
               @on-clear="onClear"></Date-picker>
</template>
<script>
  /**
   * 日期选择器
   * @author    chenliangshan
   * @addTime   2017/06/30
   */

  import { formatDate } from 'iview/src/components/date-picker/util'

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
    },
    methods: {
      onChange() {
        this.$emit('on-change')
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
    },
    watch: {
      value(val) {
        this.dateVal = val
      },
      dateVal(val) {
        let date = val
        if (val) {
          if (this.dateType === 'string' && Object.prototype.toString.call(val) === '[object Date]' && (formatDate(val, this.format) !== this.value || !this.cycle)) {
            date = val ? formatDate(val, this.format) : ''
          } else if (this.dateType === 'date' && (val !== this.value || !this.cycle)) {
            date = new Date(val)
          }
          // 初始周期结束
          if (!this.cycle) this.cycle = 1
        }
        this.$emit('input', date)
      },
    },
  }
</script>
