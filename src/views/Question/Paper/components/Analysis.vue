<template>
  <Modal
    class="v-question-analysis"
    :value="visible"
    @input="toggleAnalysis"
    title="试题解析"
  >
    <header>
      <span>题目ID: {{data.question_id}}</span>
      <span>题型: {{data.question_type_name}}</span>
      <span>难度: {{data.question_difficulty_name}}</span>
      <span>日期: {{data.created_at | dateFormat}}</span>
      <p>来源: {{data.from_name}}</p>
      <p>知识点: {{data.knowledge_name}}</p>
    </header>
    <article>
      <h3>【题目】</h3>
      <div v-html="data.content"></div>
      <h3>【答案】</h3>
      <div v-html="answer"></div>
      <h3>【解析】</h3>
      <div v-html="data.analysis"></div>
    </article>
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

export default {
  name: 'v-question-analysis',

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

  computed: {
    answer() {
      if (!this.data.question_template) return null
      if (this.data.question_template === 1) {
        const answer = this.data.question_answers
          .find(item => item.is_correct)
        return answer.option
      }
      return this.data.analysis
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
@import '~vars';
@import '../mixins/paper.less';

.v-question-analysis {

  & header {
    font-size: 14px;
    margin-bottom: 10px;

    & span {
      margin-right: 10px;
    }
  }

  & article {
    background-color: @bg-color;
    padding: @layout-padding;
    max-height: 500px;

    & > div {
      margin-bottom: @layout-gutter;
    }
  }
}
</style>
