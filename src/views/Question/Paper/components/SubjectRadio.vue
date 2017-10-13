<template>
  <div class="v-subject-radio">
    <span class="title">学科</span>
    <AppButtonRadio
      class="options"
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
  name: 'v-subject-radio',

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
      /* eslint-disable prefer-template */
      const url = this.$route.path
        + `?equal[grade_range_subject_id]=${subject.id}`
      /* eslint-enable */
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
@import '~vars';
@import '../mixins/paper.less';

.v-subject-radio {
  .condition();
}
</style>
