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

  import { toDate, formatDate } from 'iview/src/components/date-picker/util'

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
      value: {
        type: String,
        default: '',
      },
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
        if (toDate(val)) {
          time = formatDate(val, this.format)
        }
        this.$emit('input', time)
      },
    },
  }
</script>
