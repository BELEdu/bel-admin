<template>
  <div class="question-analysis" :style="{width:`${questionSize}px`}">
    <h3>【题目】</h3>
    <article v-html="data.content" class="clearfix"></article>

    <!-- 选择题选项区域 -->
    <ul v-if="isChoice" class="question-analysis__choice clearfix">
      <li
      v-for="(item,index) in choiceItems"
      :key="index"
      :style="{width: `${choiceItemWidth}%`}"
      v-html="item"
      ></li>
    </ul>

    <!-- 展示用数据 -->
    <ul v-if="isChoice">
      <br><br><br><br>
      <li>题目宽度：{{questionSize}}像素</li>
      <li>每行可容纳字符数：{{wordsPerLine}}</li>
      <li>选项有几项：{{answerLength}}</li>
      <li>过滤后：<br>{{filterArray}}</li>
      <li>每项字符数：{{filterArrayLength}}</li>
      <li>最长的字符数：{{choiceMaxLength}}</li>
      <li>如果放一行，每项最多几个字：{{ Math.floor(40 / answerLength)}}</li>
      <li>每行放几个（图片除外）：{{choiceCountPerLine}}</li>
      <li>百分比：{{choiceItemWidth}}</li>
    </ul>

    <h3>【答案】</h3>
    <article
      class="question-analysis__answer clearfix"
      v-html="questionAnswer"
    ></article>
    <h3>【解析】</h3>
    <article
      v-html="data.analysis"
      class="clearfix"
    ></article>
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
    questionSize: {
      type: Number,
      default: 500,
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

    // 答案共有几项
    answerLength() {
      return this.data.answers.length
    },

    // 是否为选择题题型
    isChoice() {
      return this.data.question_template === 1
    },

    // 选择题题型每行可容纳字符数
    wordsPerLine() {
      return Math.floor(this.questionSize / 12.5)
    },

    // 选择题的任意选项中是否包含图片
    isChoiceHasImage() {
      return this.isChoice && this.data.answers.some(answer => answer.content.includes('<img'))
    },

    // 最终用于渲染选择题选项的HTML字符串
    choiceItems() {
      return this.data.answers
        .map(({ option, content }) => (`${option}. ${content}`))
    },

    // 计算选择题的每一个选项的字符串长度，返回最长的一项的长度
    choiceMaxLength() {
      const choiceLengths = this.choiceItems
        .map(content => content.replace(/(<[^<>]+>)|\s/g, ''))
        .map(filteredContent => filteredContent.length)

      return Math.max(...choiceLengths)
    },

    // （展示用）过滤后数组
    filterArray() {
      return this.choiceItems.map(content => content.replace(/(<[^<>]+>)|\s/g, ''))
    },

    // （展示用）过滤后数组每项字符数
    filterArrayLength() {
      return this.filterArray.map(filteredContent => filteredContent.length)
    },

    /**
     * 计算每行应该显示几项选择题选项
     * 一行可显示的字符长度大约为40，计算得出以下结果（计算时必须计入A. B. C. D.这些字符）
     * 若任一选项其字符串长度超过18，则每行只显示一项（相当于总共显示4行）
     * 若任一选项其字符串长度超过8，则每行显示两项（相当于总共显示2行）
     * 否则每行显示全部四项（相当于总共只显示1行）
     */
    choiceCountPerLine() {
      if (this.choiceMaxLength > Math.floor(this.wordsPerLine / 2)) {
        return 1
      } else if (this.choiceMaxLength > Math.floor(this.wordsPerLine / this.answerLength)) {
        return 2
      }
      return this.answerLength
    },

    /**
     * 计算选择题每个选项显示时的宽度
     * 若任一选项中包含有图片，则所有选项都自占一行，宽度为100%
     * 否则，根据choiceCountPerLine计算出百分比宽度
     */
    choiceItemWidth() {
      if (this.isChoiceHasImage) {
        return 100
      }
      return 100 / this.choiceCountPerLine
    },
  },
}
</script>

<style lang="less">
@import '~vars';

@question-width: 500px;

.question-analysis {
  font-family: Times New Roman;
  margin: auto;
  // width: @question-width !important;
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

      & p {
        display: inline;
      }
    }
  }

  // img[data-latex] {
  //   vertical-align: middle;
  // }
  img {
    vertical-align: middle;
  }

  &__answer {
    p {
        display: inline;
    }
  }
}


</style>
