<template>
  <section
    v-if="paper"
    class="question-paper-detail"
  >
    <header>
      <h2>{{paper.display_name}}</h2>
      <span>年级: {{paper.grade_name}}</span>
      <span>| 类型: {{paper.paper_type_name}}</span>
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
            <app-question
              :index="index + 1"
              :data="item"
              :width="850"
            ></app-question>
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
    <footer>
      <Button
        type="primary"
        @click="goBack"
      >返回</Button>
    </footer>

    <v-analysis
      :visible.sync="analysisModal.active"
      :data="analysis"
    ></v-analysis>
  </section>
</template>

<script>
/**
 * 题库中心 - 试卷 - 试卷详情
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'
import goBack from '@/mixins/goBack'
import vAnalysis from './components/Analysis'

export default {
  name: 'question-paper-detail',

  mixins: [goBack],

  components: {
    vAnalysis,
  },

  data: () => ({
    paper: null,

    analysisModal: {
      active: false,
    },

    analysis: {},

    backRoute: '/question/paper',
  }),

  methods: {
    activateAnalysis(data) {
      this.analysisModal.active = true
      this.analysis = data
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
  width: calc(@layout-width - 90px);

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
    margin-top: 15px;
    text-align: center;

    & button {
      width: 100px;
    }
  }
}
</style>
