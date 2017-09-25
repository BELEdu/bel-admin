<template>
  <div class="question-analysis">
    <article>
      <h3>【题目】</h3>
      <div v-html="data.content"></div>
      <h3>【答案】</h3>
      <div v-html="questionAnswer"></div>
      <h3>【解析】</h3>
      <div v-html="data.analysis"></div>
    </article>
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
    questionTemplate() {
      return this.data.question_type_id
    },

    /**
     * 筛选出正确答案，并将其格式化为大写字母ABCD的形式
     * ABCD是根据答案在数组中的位置计算的，如数组的第一项0对应A
     * 这里使用charCode来将数组的下标转换为大写字母
     */
    questionAnswer() {
      if (this.questionTemplate === 1) {
        const charCodeOfA = 'A'.charCodeAt(0)
        return this.data.answers
          .map(({ is_correct }, index) => ({ index, is_correct }))
          .filter(({ is_correct }) => is_correct)
          .map(({ index }) => String.fromCharCode(index + charCodeOfA))
          .join('，')
      } else if (this.questionTemplate === 2) {
        return this.data.answers
          .map(({ is_correct }) => (is_correct === 1 ? '对' : '错'))
          .join('，')
      } else if (this.questionTemplate === 3) {
        return this.data.answers
          .map(({ content }) => content)
          .join('')
      }
      return this.data.answers[0].content || ''
    },
  },

  methods: {

  },
}
</script>

<style lang="less">
@import '~vars';

@layout-gutter: 10px;
@layout-padding: 10px;
@max-height: 300px;

.question-analysis {

  & article {
    background-color: @bg-color;
    padding: @layout-padding;
    max-height: @max-height;
    overflow: auto;

    & > h3 {
      margin-bottom: 8px;
    }

    & > div {
      margin-bottom: @layout-gutter;

      &:last-child {
        margin-bottom:0;
      }
    }
  }
}
</style>
