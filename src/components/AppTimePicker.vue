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
  import isEqual from 'lodash/isEqual'

  export default {
    name: 'app-time-picker',
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
      value: [String, Array, Date],
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
    data() {
      return {
        timeVal: this.value,
      }
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
        this.timeVal = val
      },
      timeVal(val, oldVal) {
        if (val && !isEqual(val, oldVal) &&
          (Object.prototype.toString.call(val) === '[object Date]' ||
            (Object.prototype.toString.call(val) === '[object Array]' &&
              Object.prototype.toString.call(val[0]) === '[object Date]'))) {
          return this.timeFormat(val)
        }
        return this.$emit('input', val)
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
      // 校验
      validateVal() {
        if (this.formItem.prop && this.getFormRequired()) {
          this.formItem.validate('', (valid) => {
            this.$emit('on-validate', valid)
          })
        }
      },
      // 时间格式转换
      timeFormat(val) {
        let time = val
        const handleFormatDate = data => formatDate(setTime(data), this.format)
        // 输入字符类型
        if (toDate(time) && this.timeType === 'string') {
          time = handleFormatDate(time)
        } else if (this.timeType === 'timerange') {
          time = [handleFormatDate(time[0]), handleFormatDate(time[1])]
        } else if (this.timeType === 'date') {
          time = setTime(time)
        }
        if (((Object.prototype.toString.call(time) === '[object Array]' && time[0]) || time)) {
          this.validateVal()
        }
        this.$emit('input', time)
      },
    },
  }
</script>
