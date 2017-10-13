<template>
  <div class="question-paper-composition">
    <div class="content">
      <!-- 左：树形搜索 -->
      <aside>
        <nav class="clearfix">
          <span
            :class="{
              active: myLabelTree
            }"
            @click="myLabelTree = true"
          >按我的标签</span>
          <span
            :class="{
              active: !myLabelTree
            }"
            @click="myLabelTree = false"
          >按知识点</span>
        </nav>
        <TreeSide
          v-show="myLabelTree"
          :key="`${currentSubject}label`"
          class="content__tree"
          :data="labelTree"
          @batch-select="ids => onTreeSelect('user_label_id', ids)"
          @single-select="ids => onTreeSelect('user_label_id', ids)"
        />
        <TreeSide
          v-show="!myLabelTree"
          :key="`${currentSubject}knowledge`"
          class="content__tree"
          :data="knowledgeTree"
          @batch-select="ids => onTreeSelect('knowledge_id', ids)"
          @single-select="ids => onTreeSelect('knowledge_id', ids)"
        />
      </aside>
      <!-- 右：主体 -->
      <section>
        <!-- 科目过滤 -->
        <ConditionRadioSubject
          v-if="subjects"
          :data="subjects.data"
          :default="subjects.default"
          @change="getPrecondition"
        />
        <!-- 上部：高级搜索 -->
        <ConditionRadio
          v-for="(condition, key) in advanceConditions"
          :key="key"
          :label="condition.label"
          :data="condition.data"
          :tag="`equal[${key}]`"
          :readonly="tempory.active && key==='question_type_id'"
        />
        <!-- 中部：帮助条 -->
        <div class="content__help"
          v-if="buffer.data"
        >
          <Button
            v-if="buffer.data.length
              &&buffer.data.every(topic => questionExisted(topic))
            "
            type="text"
            @click="batchRemoveQuestions"
          >取消全部加入</Button>
          <Button
            v-else
            type="text"
            @click="batchAddQuestion"
          >本页全部加入</Button>
          <span>总共<em>{{buffer.data.length}}</em>题</span>
          <Page
            class="app-page-small"
            @on-change="goTo"
            :total="buffer.total"
            :page-size="buffer.per_page"
            :current="buffer.current_page"
            placement="top"
          ></Page>
        </div>
        <!-- 下部：题目列表 -->
        <div
          class="content__topic"
          v-for="topic in buffer.data" :key="topic.id"
        >
          <!-- 题目内容 -->
          <app-question
            class="content__topic-content"
            :data="topic" :width="850"
          ></app-question>
          <!-- 题目控件 -->
          <div class="content__topic-bar">
            <Button
              v-if="tempory.active"
              size="small" type="primary"
              :disabled="questionExisted(topic)"
              @click="updateTopic(topic)"
            >更换试题</Button>
            <template v-else>
              <Button
                v-if="questionExisted(topic)"
                size="small"
                @click="removeQuestion(topic)"
              >移除试卷</Button>
              <Button
                v-else
                size="small"
                type="primary"
                @click="addQuestion(topic)"
              >加入试卷</Button>
            </template>
            <Button
              size="small"
              type="primary"
              @click.stop="activateAnalysis(topic)"
            >
              查看解析
            </Button>
            <span>难度系数：
              <span>{{topic.question_difficulty_name}}</span>
            </span>
            <span>题型：{{topic.question_type_name}}</span>
          </div>
        </div>
      </section>
    </div>

    <!-- 屏幕右下角选中题目提示 -->
    <ul class="question-paper-composition__cart">
      <li
        v-for="item in paper.question_types"
        :key="item.question_type_id"
      >{{item.display_name}}({{item.questions.length}})</li>
      <li>
        <Button
          type="primary" size="small" long
          @click="toCreatePaper()"
        >生成试卷</Button>
      </li>
    </ul>

    <v-analysis
      :visible.sync="analysisModal.active"
      :data="analysis"
    ></v-analysis>
  </div>
</template>

<script>
/**
 * 题库中心 - 试卷 - 组卷中心
 *
 * @author huojinzhao
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { GLOBAL, QUESTION } from '@/store/mutationTypes'
import {
  ConditionRadio,
  ConditionRadioSubject,
  TreeSide,
} from '@/views/components'
import vAnalysis from './components/Analysis'
import paperBiz from './mixins/paper'

export default {
  name: 'question-paper-composition',

  mixins: [list, paperBiz],

  components: {
    ConditionRadioSubject,
    ConditionRadio,
    TreeSide,
    vAnalysis,
  },

  data: () => ({
    // server: 学科选择数据
    subjects: null,

    // server: 知识点树
    knowledgeTree: [],

    // server: 标签树
    labelTree: [],

    // 切换树的数据类型
    myLabelTree: true,

    // server: 高级搜索数据
    advanceConditions: null,

    // server: 题目数据
    buffer: {},

    // 查看解析
    analysisModal: {
      active: false,
    },

    analysis: {},

    // 组卷试题数据
    paper: {
      question_types: [],
    },
  }),

  computed: {
    ...mapState({
      tempory: state => state.question.paper.tempory,
    }),

    queryUrl() {
      const url = this.$route.fullPath
      const index = url.indexOf('?')
      return index > -1 ? url.slice(index) : ''
    },

    createPaperUrl() {
      const id = this.$route.params.id
      if (!id) {
        return `/question/paper/creation?${this.currentSubject}`
      }
      return `/question/paper/creation/${id}?${this.currentSubject}`
    },
  },

  methods: {
    /* --- Initialization --- */

    getPrecondition(subjectId) {
      /* eslint-disable prefer-template */
      const url = '/question/for_paper_before'
        + (subjectId ? `?grade_range_subject_id=${subjectId}` : '')
      /* eslint-enable */

      return this.$http.get(url)
        .then(({
          // 高级搜索
          current_grade_range_subject_id,
          grade_range_subject_id,
          question_type_id,
          paper_type,
          question_difficulty,
          // 树结构数据
          knowledge_tree,
          user_label_list,
        }) => {
          this.subjects = {
            data: grade_range_subject_id,
            default: current_grade_range_subject_id,
          }
          this.advanceConditions = {
            question_type_id,
            paper_type,
            question_difficulty,
          }
          this.generatePaper(question_type_id.data)
          this.knowledgeTree = knowledge_tree
          this.labelTree = user_label_list
        })
    },

    // 1. 生成试卷信息；2. 变换学科，清空原本选题;
    generatePaper(types) {
      this.paper.question_types = types
        .map(type => ({
          question_type_id: type.id,
          display_name: type.display_name,
          questions: [],
        }))
    },

    getData(queryUrl) {
      const url = queryUrl
        ? `/question/for_paper${queryUrl}&per_page=20`
        : '/question/for_paper?perpage=20'
      return this.$http.get(url)
        .then((res) => {
          this.buffer = this.initQuestions(res)
        })
    },

    initQuestions(buffer) {
      const data = buffer.data.map(question => ({
        ...question,
        question_id: question.id,
        score: 0,
      }))
      return { ...buffer, ...{ data } }
    },

    onTreeSelect(key, ids) {
      if (ids.length > 1) {
        this.onBatchSelect(key, ids)
      } else {
        this.onSingleSelect(key, ids)
      }
    },

    onBatchSelect(key, ids) {
      const fragment = this.batchUrl(key, ids)
      this.searchData(this.recombineQuery(fragment))
    },

    onSingleSelect(key, [id]) {
      const fragment = id ? `equal[${key}]=${id}` : ''
      this.searchData(this.recombineQuery(fragment))
    },

    // 通过side-tree获取数据，无记忆
    searchData(url) {
      this.$store.commit(GLOBAL.LOADING.SHOW)
      this.getData(url)
        .catch(() => {
          this.$Notice.error({
            title: '无法访问数据，请稍后再试',
            duration: 0,
          })
        })
        .then(() => {
          this.$store.commit(GLOBAL.LOADING.HIDE)
        })
    },

    /* --- Control--- */

    toCreatePaper() {
      this.$store.commit(QUESTION.PAPER.COMPOSE, { ...this.paper })
      this.$store.commit(QUESTION.PAPER.CANCEL_TEMPORY)
      this.$router.push(this.createPaperUrl)
    },

    activateAnalysis(data) {
      this.analysisModal.active = true
      this.analysis = data
    },

    /* --- assistance --- */

    questionExisted(question) {
      return this.paper.question_types
        .some((type) => {
          if (type.question_type_id === question.question_type_id) {
            return type.questions
              .some(item => item.question_id === question.question_id)
          }
          return false
        })
    },

    batchUrl(key, values) {
      return values
        .reduce((acc, value) => `${acc}&in[${key}][]=${value}`, '')
    },

    recombineQuery(fragment) {
      return this.queryUrl
        ? `?${this.queryUrl}&${fragment}`
        : `?${fragment}`
    },

    /* --- business --- */

    addQuestion(topic) {
      this.paper.question_types.forEach((type) => {
        if (type.question_type_id === topic.question_type_id) {
          type.questions.push(topic)
        }
      })
    },

    removeQuestion(topic) {
      this.paper.question_types.forEach((type) => {
        if (type.question_type_id === topic.question_type_id) {
          const index = type.questions
            .findIndex(question => question.question_id === topic.question_id)
          if (index > -1) type.questions.splice(index, 1)
        }
      })
    },

    batchAddQuestion() {
      this.batchRemoveQuestions()
      this.buffer.data
        .forEach(topic => this.addQuestion(topic))
    },

    batchRemoveQuestions() {
      this.buffer.data
        .forEach(topic => this.removeQuestion(topic))
    },

    /* update topic */

    updateTopic(topic) {
      // 切换试题
      const { sindex, tindex } = this.tempory
      this.paper.question_types[sindex]
        .questions
        .splice(tindex, 1, { ...topic })
      // 重新生成试卷
      this.toCreatePaper()
    },
  },
}
</script>

<style lang="less">
@import '~vars';
@import '../mixins/style';

@layout-width:    1160px;
@layout-padding:  10px;
@layout-gutter:   10px;
@border-radius:  4px;

.question-paper-composition {
  width: @layout-width;

  & .content {

    & > aside {
      .sideframe();
      margin-top: @layout-padding;

      & > nav {
        background-color: @bg-color;
        height: 35px;

        & > span {
          float: left;
          width: 50%;
          line-height: 35px;
          text-align: center;

          &:hover {
            cursor: pointer;
            color: @info-color;
          }

          &.active {
            background-color: #fff;
            color: inherit;
            cursor: default;
          }
        }
      }

      & .v-side-tree .ivu-tree {
        max-height: 519px;
      }
    }

    & > section {
      padding-left: 20px;
      overflow: hidden;
    }

    &__help {
      margin-top: @layout-gutter;
      padding: @layout-padding;
      border-radius: @border-radius;
      background: @bg-color;

      & > button {
        margin-right: @layout-gutter;
        padding: 0;
        color: @info-color;

        &:hover {
          color: lighten(@info-color, 10%);
        }
      }

      & > span {

        & > em {
          color: @error-color;
        }
      }

      .app-page-small {
        float: right;
        margin-top: 0;
      }
    }

    &__topic {
      margin-top: @layout-gutter;
      border: 1px solid @border-color-base;
      border-radius: @border-radius;

      &-content {
        padding: @layout-padding;
      }

      &-bar {
        padding: @layout-padding;
        background-color: @bg-color;

        &>span {
          float: right;
          margin-left: @layout-gutter;
          line-height: 24px;

          &>span {
            color: @error-color;
          }
        }
      }

      & button {
        margin-right: @layout-gutter;
      }
    }
  }

  &__cart {
    position: fixed;
    left: 1420px;
    bottom: 95px;
    border: 1px solid @border-color-base;
    border-radius: @border-radius;
    padding: 10px 17px;
    background-color: transparent;

    &>li {
      margin-bottom: 4px;
      text-align: center;

      &>button {
        margin-top: 10px;
      }
    }
  }
}
</style>
