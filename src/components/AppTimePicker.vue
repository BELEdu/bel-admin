<template>
  <Time-picker :type="type"
               v-model="timeVal"
               :format="format"
               :placeholder="placeholder"
               :disabled="disabled"
               :readonly="readonly"
               :editable="editable"
               @on-change="onChange"
               @on-open-change="onOpenChange"
               @on-ok="onOk"
               @on-clear="onClear"></Time-picker>
</template>
<script>
  /**
   * 时间选择器
   * @author    chenliangshan
   * @addTime   2017/06/30
   */

  import { toDate, formatDate, setTime } from '@/utils/date'

  export default {
    name: 'app-time-picker',
    data() {
      return {
        timeVal: null,
      }
    },
    props: {
      type: {
        type: String,
        default: 'time',
      },
      // 设置输出类型
      timeType: {
        type: String,
        default: 'string',
      },
      value: [String, Date],
      format: {
        type: String,
        default: 'HH:mm:ss',
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
      this.timeVal = this.value
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
      // 时间格式转换
      timeFormat(val) {
        let time = val || ''
        if (val) {
          // 输入字符类型
          if (toDate(val) && this.timeType === 'string') {
            time = formatDate(setTime(val), this.format)
          } else if (this.timeType === 'date') {
            time = setTime(val)
          }
        }
        this.$emit('input', time || null)
      },
    },
    watch: {
      value(val) {
        this.timeVal = val
      },
      timeVal(val) {
        if (val) {
          this.timeFormat(val)
        } else {
          this.$emit('input', null)
        }
      },
    },
  }
</script>
