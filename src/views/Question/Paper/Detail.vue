<template>
  <section
    v-if="paper"
    class="question-paper-detail"
  >
    <header>
      <h2>{{paper.display_name}}</h2>
      <span>年级: {{paper.grade_name}}</span>
      <span>| 类型: {{paper.paper_type_name}}|</span>
      <span>| 区域: {{paper.area_name}}</span>
      <span>| 年份: {{paper.year}}</span>
      <span>| 题数: {{paper.question_count}}</span>
      <span>总分: {{paper.total_score}}分</span>
    </header>
    <article>
      <div
        v-for="(type, index) in paper.question_types"
        class="section"
      >
        <h2>
          {{index + 1}}、{{type.display_name}}
          （共{{type.question_count}}小题，总计{{type.total_score}}分）
        </h2>
        <ul class="topic">
          <li
            v-for="(item, index) in type.questions"
            class="topic-item"
          >
            <span style="
              margin-right: 5px;
              float: left;
             ">{{index + 1}}、</span>
            {{item.content}}
            <div class="topic-item__control">
              <Button
                @click="activateAnalysis(item)"
                size="small"
              >查看解析</Button>
             </div>
          </li>
        </ul>
      </div>
    </article>
    <footer>
      <Button
        type="primary"
        @click="deactivateAnalysis"
      >返回</Button>
    </footer>

    <Modal
      class="question-paper-detail__analysis"
      v-if="analysis"
      v-model="analysisModal.active"
      title="试题解析"
    >
      <div class="question-paper-detail__analysis-header">
        <span>题目ID: {{analysis.question_id}}</span>
        <span>题型: {{analysis.question_type_name}}</span>
        <span>难度: {{analysis.question_difficulty_name}}</span>
        <span>日期: {{analysis.created_at | dateFormat}}</span>
        <p>来源: {{analysis.from_name}}</p>
        <p>知识点: {{analysis.knowledge_name}}</p>
      </div>
      <article>
        <h3>【题目】</h3>
        <div>{{analysis.content}}</div>
        <h3>【答案】</h3>
        <div>{{answer}}</div>
        <h3>【解析】</h3>
        <div>{{analysis.anlysis}}</div>
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
  </section>
</template>

<script>
/**
 * 题库中心 - 试卷 - 试卷详情
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'question-paper-detail',

  data: () => ({
    paper: null,

    analysisModal: {
      active: false,
    },

    analysis: null,
  }),

  computed: {
    answer() {
      if (!this.analysisInfo) return null
      if (this.analysisInfo.question_template === 1) {
        const answer = this.analysisInfo.answers
          .find(item => item.is_correct)
        return answer.option
      }
      return this.analysisInfo.analysis
    },
  },

  methods: {
    activateAnalysis(data) {
      this.analysisModal.active = true
      this.analysis = data
    },

    deactivateAnalysis() {
      this.analysisModal.active = false
    },
  },

  filters: {
    dateFormat(value) {
      return value.slice(0, 10)
    },
  },

  created() {
    const id = this.$route.params.id
    this.$http.get(`/paper/${id}`)
      .then((res) => {
        this.paper = res
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },
}
</script>

<style lang="less">
@import "~vars";
@import './mixins/paper.less';

.question-paper-detail {
  width: @layout-width;

  & > header {
    margin-bottom: 20px;

    & > h2 {
      margin-bottom: 5px;
    }

    & > span {
      font-size: 14px;
    }
  }

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

  & > footer {
    text-align: center;

    & button {
      width: 100px;
    }
  }
}

.question-paper-detail__analysis {

  &-header {
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
