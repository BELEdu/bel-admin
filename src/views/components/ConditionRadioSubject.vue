<template>
  <div class="condition-radio-subject">
    <span class="condition-radio-subject__title">学科</span>
    <AppButtonRadio
      class="condition-radio-subject__options"
      :value="subjectId"
      :data="data"
      size="small"
      @change="changeSubject"
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
  name: 'ConditionRadioSubject',

  props: {
    data: {
      type: Array,
      required: true,
    },

    default: {
      type: Number,
      required: true,
    },
  },

  computed: {
    subjectId() {
      const subjectId = this.$route.query['equal[grade_range_subject_id]']
      return parseInt(subjectId, 10) || this.default
    },
  },

  methods: {
    changeSubject(subject) {
      if (subject.id === this.subjectId) return

      const query = {
        'equal[grade_range_subject_id]': subject.id,
      }

      this.$emit('change', subject.id)

      this.$router.push({ query })
    },
  },
}
</script>

<style lang="less">
@import './style/conditionRadio';

.condition-radio-subject {
  .condition-radio-group();
}
</style>
