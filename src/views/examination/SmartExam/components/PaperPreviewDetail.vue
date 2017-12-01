<template>
  <div class="paper-preview-detail">

    <!-- 试卷区域 -->
    <article>
      <div
        v-for="(type, index) in data.question_types"
        class="section"
      >
        <h2>
          {{index + 1}}、{{type.display_name}}
          （
          共{{type.question_count}}小题，
          总计{{type.total_score}}分
          ）
        </h2>
        <ul class="topic">
          <li
            v-for="(item, index) in type.questions"
            class="topic-item"
          >
            <question
              :index="index + 1"
              :data="item"
              :score="item.score"
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
          </li>
        </ul>
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
import { Question, QuestionAnalysisDialog } from '@/views/components'

export default {

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

    width: {
      type: [String, Number],
      default: 850,
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
@import '../mixins/paper.less';

.paper-preview-detail {
  width: calc(@layout-width - 280px);

  & > article {

    & .section {
      .section()
    }

    & .topic {
      .topic()
    }

    & h3 {
      font-size: 14px;
    }
  }
}
</style>
