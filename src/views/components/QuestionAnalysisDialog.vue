<template>
  <Modal
    class="question-analysis-dialog"
    :value="visible"
    @input="toggleAnalysis"
    title="试题解析"
  >
    <header v-if="Object.keys($slots).length === 0">
      <span>题目ID: {{data.question_id}}</span>
      <span>题型: {{data.question_type_name}}</span>
      <span>难度: {{data.question_difficulty_name}}</span>
      <span>日期: {{data.created_at | dateFormat}}</span>
      <p>来源: {{data.from_name}}</p>
      <p>知识点: {{data.knowledge_name}}</p>
    </header>

    <slot></slot>

    <QuestionAnalysis
      :data="data"
    />

    <div
      slot="footer"
    >
      <Button
        type="primary"
        @click="deactivateAnalysis"
      >返回</Button>
    </div>
  </Modal>
</template>

<script>
/**
 * 题库中心 - 试卷 - 查看解析
 *
 * @author huojinzhao
 */
import QuestionAnalysis from './QuestionAnalysis'

export default {
  name: 'QuestionAnalysisDialog',

  components: {
    QuestionAnalysis,
  },

  props: {
    data: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },

  filters: {
    dateFormat(value) {
      return value ? value.slice(0, 10) : ''
    },
  },

  methods: {
    toggleAnalysis(value) {
      this.$emit('update:visible', value)
    },

    deactivateAnalysis() {
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style lang="less">
.question-analysis-dialog {
  & .ivu-modal {
    width: 600px !important;
  }

  & header {
    font-size: 14px;
    margin-bottom: 10px;

    & span {
      margin-right: 10px;
    }
  }
}
</style>
