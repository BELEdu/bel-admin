<template>
  <Time-picker :type="type"
               v-model="timeVal"
               :format="format"
               :placeholder="placeholder"
               :disabled="disabled"
               :readonly="readonly"
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

  import { toDate, formatDate } from '@/utils/date'

  export default {
    name: 'app-time-picker',
    data() {
      return {
        timeVal: this.value,
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
        this.timeVal = val
      },
      timeVal(val) {
        let time = val || ''
        if (val) {
          const fnTime = (value) => {
            if (typeof value === 'string') {
              const date = new Date()
              const dateTime = value.split(':')
              // 设置时间
              date.setHours(dateTime[0])
              date.setMinutes(dateTime[1])
              if (dateTime.length >= 3) {
                date.setSeconds(dateTime[2])
              }
              return date
            }
            return value
          }
          // 输入字符类型
          if (toDate(val) && this.timeType === 'string') {
            time = formatDate(fnTime(val), this.format)
          } else if (this.timeType === 'date') {
            time = fnTime(val)
          }
        }
        this.$emit('input', time)
      },
    },
  }
</script>
