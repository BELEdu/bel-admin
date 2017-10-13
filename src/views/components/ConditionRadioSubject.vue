<template>
  <div class="condition-radio-subject">
    <span class="condition-radio-subject__title">学科</span>
    <AppButtonRadio
      class="condition-radio-subject__options"
      v-model="subjectId"
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

  data: () => ({
    subjectId: 0,
  }),

  methods: {
    changeSubject(subject) {
      // eslint-disable-next-line
      const url = this.$route.path
        + `?equal[grade_range_subject_id]=${subject.id}`
      this.$emit('change', subject.id)
      this.$router.push(url)
    },
  },

  created() {
    const subjectId = this.$route.query['equal[grade_range_subject_id]']
    this.subjectId = parseInt(subjectId, 10) || this.default
  },
}
</script>

<style lang="less">
@import './style/conditionRadio';

.condition-radio-subject {
  .condition-radio-group();
}
</style>
