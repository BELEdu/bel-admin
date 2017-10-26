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
}
</style>
