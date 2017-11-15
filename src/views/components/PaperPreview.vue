<script>
/**
 * 试卷 - 试卷预览组件
 *
 * @author  huojinzhao
 */

// 试卷原始数据，在外面准备
// paper: {
//   grade_range_subject_id: null,
//   campuses: [[]],
//   grade: null,
//   subject_type: null,
//   paper_type: null,
//   year: null,
//   display_name: '',
//   exam_time: 0,
//   question_types: [],
// },

import PaperPreviewForm from './PaperPreviewForm'
import PaperPreviewSection from './PaperPreviewSection'

export default {
  name: 'PaperPreview',

  components: {
    PaperPreviewForm,
    PaperPreviewSection,
  },

  props: {
    // 试卷数据，包含试题列表
    data: {
      type: Object,
      required: true,
    },

    // 是否放在模态框中
    inModal: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    totalScore() {
      return this.data.question_types
        .reduce((acc, type) => (type.sectionScore
          ? acc + type.sectionScore
          : acc
        ), 0)
    },
  },

  methods: {
    v_figureViewIndex(sIndex) {
      return this.data.question_types.reduce((
        acc,
        section,
        index,
      ) => (
        section.questions.length && index < sIndex
          ? acc + 1 : acc
      ), 1)
    },

    /**
     * 暴露给外部验证PaperPreviewForm的方法
     *
     * @param   {Function(valid)}   callback
     */
    $_formValidate(
      callback = () => {},
    ) {
      const valid = this.$refs.previewForm.$_validate()
      callback(valid)
    },
  },
}
</script>

<template>
  <div :class="{ 'paper-preview': inModal }">
    <PaperPreviewForm
      ref="previewForm"
      :data="data"
    />

    <div class="paper-preview__totalscore">
      <span>考试总分</span>
      <Input :value="totalScore" disabled></Input>
      <span>分</span>
    </div>

    <PaperPreviewSection
      v-for="(section, sIndex) in data.question_types"
      v-if="section.questions.length"
      :key="section.question_type_id"
      :data="section"
      :s-index="sIndex"
      :v-index="v_figureViewIndex(sIndex)"
    />
  </div>
</template>

<style lang="less">
.paper-preview {
  max-height: 700px;
  overflow: auto;

  &__totalscore {
    margin-bottom: 24px;

    & > span:first-of-type {
      display: inline-block;
      margin-right: 4px;
      padding: 10px 12px 10px 0;
      width: 80px;
      text-align: right;
    }

    & .ivu-input-wrapper {
      margin-right: 8px;
      width: 201px;
    }
  }
}
</style>
