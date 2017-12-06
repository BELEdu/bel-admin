<template>
  <div
    class="paper-readonly-body"
    :class="{ 'paper-readonly-body__print-wrap':isPrintWrap}"
  >
    <!-- 试卷展示区域 -->
    <article>
      <div
        v-for="(type, index) in data.question_types"
        class="section"
      >
        <h2>
          {{index + 1}}、{{type.display_name}}
          （共{{type.question_count}}小题，
          总计{{type.total_score}}分）
        </h2>
        <div class="topic">
          <div
            v-for="(item, index) in type.questions"
            class="topic-item"
          >
            <question
              :index="index + 1"
              :data="item"
              :width="width"
            ></question>

            <div class="topic-item__control">
              <Button
                @click="activateAnalysis(item)"
                size="small"
              >
                查看解析
              </Button>
            </div>

          </div>
        </div>
      </div>
    </article>

    <!-- 试题解析弹窗 -->
    <question-analysis-dialog
      :visible.sync="analysisModal.active"
      :data="analysis"
    >
      <span></span>
    </question-analysis-dialog>

  </div>
</template>

<script>
/**
 * 查看试卷 - 试题展示部分
 *
 * @author zhoumenglin
 */

import Question from './Question'
import QuestionAnalysisDialog from './QuestionAnalysisDialog'

export default {
  name: 'paper-readonly-body',

  components: {
    Question,
    QuestionAnalysisDialog,
  },

  props: {
    // 试卷数据
    data: {
      type: Object,
      required: true,
    },
    // 试题宽度，默认以A4纸比例
    width: {
      type: [String, Number],
      default: '21cm',
    },
  },

  data() {
    return {
      // 弹窗控制
      analysisModal: {
        active: false,
      },

      // 答案解析数据
      analysis: {},
    }
  },

  computed: {
    // 是否使用展示打印试卷的宽度
    isPrintWrap() {
      return this.width === '21cm'
    },
  },

  methods: {
    activateAnalysis(data) {
      this.analysisModal.active = true
      this.analysis = data
    },
  },

}
</script>

<style lang="less">
@import "~vars";
@import './style/paperReadonly.less';

.paper-readonly-body {

  &__print-wrap {
    width: 21cm + 40px;
  }

  & > article {

    & .section {
      .section()
    }

    & .topic {
      .topic()
    }
  }
}
</style>
