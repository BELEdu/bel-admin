<template>
  <div class="app-question" :style="{width:formatQuestionWidth}">

    <!-- 题目 -->
    <article
      :style="{overflow:'hidden'}"
      v-html="formatQuestionContent"
    >
    </article>

    <!-- 选择题选项区域 -->
    <div
      v-if="isChoice"
      class="app-question__choice"
      :style="{paddingTop: `10px`}"
    >
      <div
        v-for="(item,index) in choiceItems"
        :key="index"
        :style="{width: `${choiceItemWidth}%`, display: `inline-block`}"
      >

        <!-- 正确答案 -->
        <Icon
          class=""
          v-if="hasStudentAnswer && item.is_correct === 1"
          size="16"
          type="checkmark"
          class="color-success"
        />

        <!-- 学员选择的答案 -->
        <Icon
          v-if="hasStudentAnswer && IsStudentChoiceAnswer(item.id)"
          size="16"
          type="android-star"
          class="color-warning"
        ></Icon>

        <!-- 选项文本 -->
        <section v-html="item.content"></section>

      </div>
    </div>

    <!-- 学员答案展示区域 -->
    <div
      v-if="hasStudentAnswer"
      class="app-question__student-answer"
    >
      <!-- 判断题 -->
      <ul v-if="isTrueOrFalse">
        <li
          v-for="(item, index) in this.data.question_answers"
          :key="index"
        >
          <!-- 判断题选项 -->
          <span class="app-question__tf">{{item.option}}</span>

          <!-- 正确答案 -->
          <Icon
            v-if="item.is_correct === 1"
            size="16"
            type="checkmark"
            class="color-success"
          />

          <!-- 学员选择的答案 -->
          <Icon
            v-if="IsStudentTfAnswer(item.id)"
            size="16"
            type="android-star"
            class="color-warning"
          ></Icon>
        </li>
      </ul>

      <!-- 填空题 & 解答题 -->
      <img
        v-if="isFill || isEssay"
        :src="data.student_answer[0].answer_content"
        alt="学员答案图片"
      >

    </div>


    <!-- 选择展示用数据，调试用 -->
    <!-- <ul v-if="isChoice">
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
    </ul> -->

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
  name: 'question',

  props: {
    data: {
      type: Object,
      required: true,
    },
    width: {
      type: [Number, String],
      default: '21cm',
    },
    index: {
      type: [Number, String],
    },
  },

  computed: {
    // 题目长度格式化
    formatQuestionWidth() {
      const type = typeof (this.width)
      if (type === 'string') {
        return this.width
      }
      return `${this.width}px`
    },

    // 题目格式化
    formatQuestionContent() {
      // 空隔字符数
      let count = 0

      // 题目索引
      let inlineHead = ''

      // 如果有分数拼上分数
      // const score = this.data.score
      // if (score || score === 0) {
      //   count += 5
      //   inlineHead = `<span>(${this.data.score}分)</span>&nbsp;${inlineHead}`
      // }

      // 如果有索引拼上索引
      if (this.index) {
        count += 3
        inlineHead = `<span>${this.index}.</span>&nbsp;${inlineHead}`
      }

      // 返回拼接后的html, 先将题目用行内块状元素包裹
      if (count > 0) {
        return `${inlineHead}<span style="display:inline-block;vertical-align: top; width:calc(100% - ${count}em)">${this.data.content}</span>`
      }
      return this.data.content
    },

    // 是否为选择题题型
    isChoice() {
      return this.data.question_template === 1
    },

    // 是否为判断题题型
    isTrueOrFalse() {
      return this.data.question_template === 2
    },

    // 是否为填空题题型
    isFill() {
      return this.data.question_template === 3
    },

    // 是否为解答题题型
    isEssay() {
      return this.data.question_template === 4
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
        .map(({ option, content, id, is_correct }) => ({
          content: `<span>${option}. </span><span style="display:inline-block;vertical-align: top;">${content}</span>`,
          id,
          is_correct,
        }))
    },

    // 计算选择题的每一个选项的字符串长度，返回最长的一项的长度
    choiceMaxLength() {
      const choiceLengths = this.choiceItems
        .map(({ content }) => content.replace(/(<[^<>]+>)|\s/g, ''))
        .map(filteredContent => filteredContent.length)

      return Math.max(...choiceLengths)
    },

    // （展示用）过滤后数组
    filterArray() {
      return this.choiceItems.map(({ content }) => content.replace(/(<[^<>]+>)|\s/g, ''))
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

    // 是否有学员答案，要存在这个数组并且这个数组不为0
    hasStudentAnswer() {
      const thisArray = this.data.student_answer
      const hasThisArray = !!thisArray
      return hasThisArray && thisArray.length > 0
    },
  },

  methods: {
    // 判断该选项的id是不是学员选择的答案（或之一）
    IsStudentChoiceAnswer(choiceId) {
      const studentAnswerArray = this.data.student_answer || null
      if (studentAnswerArray && studentAnswerArray.length > 0) {
        return studentAnswerArray
          .map(item => item.answer_id)
          .includes(choiceId)
      }
      return false
    },

    // 判断该选项是不是学员的判断题答案
    IsStudentTfAnswer(tfId) {
      const studentAnswerArray = this.data.student_answer || null
      if (studentAnswerArray && studentAnswerArray.length > 0) {
        return studentAnswerArray[0].answer_id === tfId
      }
      return false
    },
  },

}
</script>

<style lang="less">
@import "~vars";

.app-question {
  margin: auto;
  font-family: Times New Roman;
  background-color: inherit;

  // 这个p标签的强制处理还有待考量
  p {
    margin: 0;
  }

  img {
    vertical-align: middle;
  }

  &__student-answer {
    &>img {
      margin-top: 10px;
      max-width: 100%;
    }
  }

  &__tf {
    font-size: 16px;
  }
}
</style>
