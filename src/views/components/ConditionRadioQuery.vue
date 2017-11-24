<template>
  <div class="condition-radio-query">
    <span class="condition-radio-query__title">{{label}}</span>
    <AppButtonRadio
      class="condition-radio-query__options"
      :value="value"
      :data="data"
      size="small"
      @change="changeQuery"
      :readonly="readOnly"
    />
  </div>
</template>

<script>
/**
 * 题库中心 - 学科选择组件
 *
 * @author huojinzhao
 */

export default {
  name: 'ConditionRadioQuery',

  props: {
    data: {
      type: Array,
      required: true,
    },

    default: {
      type: Number,
      required: true,
    },

    label: {
      type: String,
      default: '学科',
    },

    tag: {
      type: String,
      default: 'equal[grade_range_subject_id]',
    },

    spread: {
      type: Boolean,
      default: false,
    },

    readOnly: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    value() {
      const id = this.$route.query[this.tag] || this.default
      return parseInt(id, 10)
    },
  },

  methods: {
    changeQuery({ value }) {
      if (value === this.value) return

      const query = this.spread
        ? {
          ...this.$route.query,
          [this.tag]: value,
        } : {
          [this.tag]: value,
        }

      this.$router.push({ query })

      this.$emit('change', value)
    },
  },
}
</script>

<style lang="less">
@import './style/conditionRadio';

.condition-radio-query {
  .condition-radio-group();
}
</style>
