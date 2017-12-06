<template>
  <div class="app-question-analysis" :style="{width:`${width}px`}">

    <h3>题目</h3>
    <question
      :data="data"
      :width="width"
    ></question>

    <h3>答案</h3>
    <article
      class="app-question-analysis__answer"
      v-html="questionAnswer"
    ></article>

    <h3>解析</h3>
    <article
      v-html="data.analysis"
    ></article>

  </div>
</template>

<script>
/**
  * 试题解析渲染组件
  * @author zml
  * @version 2017-10-09
  * @param {Object} data - 试题详情
  * @param {Number, String} width - 试题宽度，默认宽度790px
  */

import Question from './Question'

export default {
  name: 'question-analysis',

  components: {
    Question,
  },

  props: {
    data: {
      type: Object,
      required: true,
    },
    width: {
      type: [Number, String],
      default: 790,
    },
  },

  computed: {
    /**
     * 试题答案渲染模板
     * 1 选择题（单选、多选）
     * 2 判断题
     * 3 填空题
     * 4 解答题
     */
    questionAnswer() {
      const { question_answers, question_template } = this.data
      switch (question_template) {
        case 1:
          return question_answers
            .map(({ option, is_correct }) => ({ option, is_correct }))
            .filter(({ is_correct }) => is_correct)
            .map(({ option }) => option)
            .join('， ')
        case 2:
          return question_answers.find(answer => answer.is_correct === 1).option
        case 3:
          return question_answers
            .map(({ content }) => content)
            .join('； ')
        case 4:
          return question_answers[0].content
        default:
          return ''
      }
    },
  },

}
</script>

 <style lang="less">
 @import '~vars';

.app-question-analysis {
  margin: auto;
  background-color: inherit;
  font-family: Times New Roman;

  &::before {
    display: block;
    content: " ";
    clear: both;
    height: 1px;
  }

  &>h3 {
    color: @primary-color;
    margin: 10px 0;

    &:first-child {
      margin: 0 0 10px 0;
    }
  }

  // 使富文本区域中的图片居中
  img {
    vertical-align: middle;
  }
}
</style>
