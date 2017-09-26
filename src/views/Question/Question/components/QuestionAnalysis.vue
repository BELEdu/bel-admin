<template>
  <div class="question-analysis">
    <h3>【题目】</h3>
    <article v-html="data.content"></article>
    <ul class="question-analysis__choice clearfix">
      <li
      v-for="(item,index) in choiceQuestion"
      :key="index"
      :style='{ width: `${choiceWidth}%` }'
      v-html="item"
      ></li>
    </ul>
    <!-- {{choiceQuestion}}
    <div>{{choiceMaxLength}}</div>
    <div>{{choiceWidth}}</div> -->
    <h3>【答案】</h3>
    <article v-html="questionAnswer"></article>
    <h3>【解析】</h3>
    <article v-html="data.analysis"></article>
  </div>
</template>

<script>
/**
 * 题库中心 - 试题解析展示组件
 * @author zml
 * @version 2017-09-25
 */

export default {
  name: 'question-analysis',

  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  computed: {
    /**
     * 试题模板
     * 1 选择题（单选、多选）
     * 2 判断题
     * 3 填空题
     * 4 解答题
     */
    questionAnswer() {
      switch (this.data.question_template) {
        case 1:
          return this.data.answers
            .map(({ option, is_correct }) => ({ option, is_correct }))
            .filter(({ is_correct }) => is_correct)
            .map(({ option }) => option)
            .join('，')
        case 2:
          return this.data.answers[0].is_correct === 1 ? '对' : '错'
        case 3:
          return this.data.answers
            .map(({ content }) => content)
            .join('；')
        case 4:
          return this.data.answers[0].content
        default:
          return ''
      }
    },

    choiceQuestion() {
      if (this.data.question_template === 1) {
        return this.data.answers
          .map(({ option, content }) => (`${option}. ${content}`))
      }
      return false
    },

    choiceMaxLength() {
      if (this.choiceQuestion) {
        if (this.choiceQuestion.some(item => /<img/.test(item))) {
          return false
        }
        return Math.max.apply(null, this.choiceQuestion.map(item => item.length))
      }
      return false
    },

    choiceWidth() {
      const l = this.choiceMaxLength
      if (l >= 24) {
        return 100
      } else if (l > 15 && l < 24) {
        return 50
      }
      return 25
    },
  },

  methods: {
    // 计算字符串长度
    strLength(str) {
      return str.lengh
    },
  },
}
</script>

<style lang="less">
@import '~vars';

@question-width: 500px;

.question-analysis {
  margin: auto;
  width: @question-width !important;
  background-color: inherit;

  &::before {
    display: block;
    content: " ";
    clear: both;
    height: 1px;
  }

  &>h3 {
    margin: 10px 0;
  }

  &__choice {
    margin-top: 10px;

    &>li {
      float: left;
      // width: 50%;
    }
  }
}
</style>
