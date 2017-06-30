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
      }
    },
    props: {
      type: {
        type: String,
        default: 'date',
      },
      value: {
        type: String,
        default: '',
      },
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
        this.$emit('input', val ? formatDate(val, this.format) : '')
      },
    },
  }
</script>
