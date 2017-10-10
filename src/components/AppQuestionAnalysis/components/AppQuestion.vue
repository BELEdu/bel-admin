<template>
  <div class="app-question" :style="{width:`${width}px`}">

    <!-- 索引 -->
    <span class="left" v-if="index">{{index}}.&nbsp;&nbsp;</span>

    <!-- 题目 -->
    <article
      class="clearfix"
      v-html="data.content"
    >
    </article>

    <!-- 选择题选项区域 -->
    <ul
      v-if="isChoice"
      class="app-question__choice clearfix"
    >
      <li
        v-for="(item,index) in choiceItems"
        :key="index"
        :style="{width: `${choiceItemWidth}%`}"
        v-html="item"
      ></li>
    </ul>

    <!-- 选择展示用数据，调试用 -->
    <ul v-if="isChoice">
      <br><br>
      <li><b>【 选择题选项调试用数据 】</b></li>
      <br>
      <li>题目宽度：{{width}}像素</li>
      <li>每行可容纳字符数：{{wordsPerLine}}</li>
      <li>选项有几项：{{answerLength}}</li>
      <li>过滤后：<br>{{filterArray}}</li>
      <li>每项字符数：{{filterArrayLength}}</li>
      <li>最长的字符数：{{choiceMaxLength}}</li>
      <li>如果放一行，每项最多几个字：{{ Math.floor(wordsPerLine / answerLength)}}</li>
      <li>每行放几个（图片除外）：{{choiceCountPerLine}}</li>
      <li>百分比：{{choiceItemWidth}}</li>
    </ul>

  </div>
</template>

<script>
/**
  * 试题题目渲染组件
  * @author zml
  * @version 2017-10-09
  * @param {Object} data - 试题详情
  * @param {Number, String} width - 试题宽度，默认宽度500像素
  * @param {Number} index - 试题索引，不传的时候不显示
  */

export default {
  name: 'app-question',

  props: {
    data: {
      type: Object,
      required: true,
    },
    width: {
      type: [Number, String],
      default: 500,
    },
    index: {
      type: Number,
    },
  },

  computed: {
    // 是否为选择题题型
    isChoice() {
      return this.data.question_template === 1
    },

    // 答案共有几项
    answerLength() {
      return this.data.question_answers.length
    },

    // 选择题题型每行可容纳字符数
    wordsPerLine() {
      return Math.floor(this.width / 12.5)
    },

    // 选择题的任意选项中是否包含图片
    isChoiceHasImage() {
      return this.isChoice && this.data.question_answers.some(answer => answer.content.includes('<img'))
    },

    // 最终用于渲染选择题选项的HTML字符串
    choiceItems() {
      return this.data.question_answers
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
.app-question {
  font-family: Times New Roman;
  margin: auto;
  background-color: inherit;

  &::before {
    display: block;
    content: " ";
    clear: both;
    height: 1px;
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
