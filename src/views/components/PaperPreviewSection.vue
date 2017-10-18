<script>
/**
 * 试卷 - 试卷预览 - 题型组件
 *
 * @author  huojinzhao
 */

import PaperPreviewQuestion from './PaperPreviewQuestion'

export default {
  name: 'PaperPreviewSection',

  components: {
    PaperPreviewQuestion,
  },

  props: {
    // 题型数据
    data: {
      type: Object,
      required: true,
    },

    // 题型在列表中索引
    sIndex: {
      type: Number,
      required: true,
    },

    // 题型视图中的位置
    vIndex: {
      type: Number,
      required: true,
    },
  },

  computed: {
    sectionScore() {
      return this.data.questions.reduce((
        acc,
        question,
      ) => acc + question.score, 0)
    },
  },

  methods: {
    vm_sortQuestion(qIndex, sortType) {
      const list = this.data.questions
      if (sortType === 'up') {
        this.exchangeNode(list, qIndex, -1)
      } else {
        this.exchangeNode(list, qIndex, 1)
      }
    },

    exchangeNode(list, index, target) {
      const node = list.splice(index, 1, list[index + target])[0]
      list.splice(index + target, 1, node)
    },

    vm_deleteQuestion(qIndex) {
      this.data.questions.splice(qIndex, 1)
    },
  },
}
</script>

<template>
  <div class="paper-preview-section">
    <h2>
      {{vIndex}}、
      {{data.display_name}}
      （
        共{{data.questions.length}}小题，
        总计{{sectionScore}}分
       ）
    </h2>

    <PaperPreviewQuestion
      v-for="(question, qIndex) in data.questions"
      :key="question.question_id"
      v-model="question.score"
      :data="question"
      :q-index="qIndex"
      :q-length="data.questions.length"
      @on-delete="vm_deleteQuestion"
      @on-sort="vm_sortQuestion"
    />
  </div>
</template>

<style lang="less">
@import './style/question';

.paper-preview-section {
  .section();
}
</style>
