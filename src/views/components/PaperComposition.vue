<script>
/**
 * 试卷 - 组卷 - 分页、排序辅助条 + 组卷试题
 *
 * @author  huojinzhao
 *
 * @param   {Object}  data    -   服务端请求的分页数据
 * @param   {Object}  paper   -   提交服务端的试卷数据
 */

import PaperCompositionPanel from './PaperCompositionPanel'
import PaperCompositionQuestion from './PaperCompositionQuestion'
import QuestionAnalysisDialog from './QuestionAnalysisDialog'
import LabelModal from './LabelModal'

export default {
  name: 'PaperComposition',

  components: {
    PaperCompositionPanel,
    PaperCompositionQuestion,
    QuestionAnalysisDialog,
    LabelModal,
  },

  inheritAttrs: false,

  props: {
    // 服务端返回的列表数据
    buffer: {
      type: Object,
      required: true,
    },

    // 组卷试卷数据
    paper: {
      type: Object,
      required: true,
    },

    questionConfig: {
      type: Object,
      default: () => ({ select: true }),
    },

    panelConfig: {
      type: Object,
      default: () => ({}),
    },
  },

  directives: {
    update: {
      bind(el, { value, arg }, vnode) {
        if (value) {
          // eslint-disable-next-line
          vnode.componentInstance[arg] = {
            ...vnode.componentInstance[arg],
            ...value,
          }
        }
      },
    },
  },

  data: () => ({
    // 试题分析弹窗数据
    analysisDialog: {
      active: false,
      data: {},
    },

    // 收藏标签弹窗数据
    labelModal: {
      active: false,
      id: null,
      number: null,
      labelIds: [],
    },
  }),

  methods: {
    /* --- Assistance --- */

    v_questionSelected({
      question_id,
      question_type_id,
    }) {
      return this.paper.question_types
        .some((type) => {
          if (
            type.question_type_id === question_type_id
          ) {
            return type.questions
              .some(question => question.question_id === question_id)
          }
          return false
        })
    },

    /* --- Control --- */

    vm_onAnalysis(question) {
      this.analysisDialog.active = true
      this.analysisDialog.data = question
    },

    v_changePage(page) {
      const { query } = this.$route

      this.$router.push({
        query: { ...query, page },
      })
    },

    /* --- Business --- */

    vm_insertQuestion(question) {
      this.paper.question_types.forEach((type) => {
        if (
          type.question_type_id === question.question_type_id
        ) {
          const temp = this.initPaperQuestion(question, type.questionDefaultScore)
          type.questions.push(temp)
        }
      })
    },

    // 加入试卷的时候为试题做初始化
    initPaperQuestion(question, defaultScore) {
      const addition = {
        score: defaultScore || 0,
        normal_duration: 0,
        excellent_duration: 0,
      }

      return { ...question, ...addition }
    },

    vm_removeQuestion(question) {
      this.paper.question_types.forEach((type) => {
        if (
          type.question_type_id === question.question_type_id
        ) {
          const index = type.questions
            .findIndex(item => item.question_id === question.question_id)
          if (index > -1) type.questions.splice(index, 1)
        }
      })
    },

    vm_batchInsertQuestions() {
      this.vm_batchRemoveQuestions()
      this.buffer.data
        .forEach(topic => this.vm_insertQuestion(topic))
    },

    vm_batchRemoveQuestions() {
      this.buffer.data
        .forEach(topic => this.vm_removeQuestion(topic))
    },

    // 打开管理收藏标签弹窗
    vm_onOpenLabelModal(question) {
      const { id, number, user_label_ids } = question
      const modal = this.labelModal
      modal.id = id
      modal.number = number
      modal.labelIds = user_label_ids
      modal.active = true
    },

    // 视图上修改收藏标签数据
    vm_fetchQuestionData(id, labelIds) {
      this.buffer.data.find(question => question.id === id).user_label_ids = labelIds
    },
  },
}
</script>

<template>
  <div class="paper-composition">
    <div class="paper-composition-assistance"
      v-if="buffer && buffer.data"
    >
      <template v-if="questionConfig.select">
        <Button
          v-if="
            buffer.data
            && buffer.data.length
            && buffer.data.every(question => v_questionSelected(question))
          "
          type="text"
          @click="vm_batchRemoveQuestions"
        >
          取消全部加入
        </Button>
        <Button
          v-else
          type="text"
          @click="vm_batchInsertQuestions"
        >
          本页全部加入
        </Button>
      </template>
      <span>
        总共<em>{{buffer.data.length}}</em>题
      </span>
      <Page
        class="app-page-small"
        :total="buffer.total"
        :page-size="buffer.per_page"
        :current="buffer.current_page"
        placement="top"
        @on-change="v_changePage"
      ></Page>
    </div>

    <template v-if="buffer.data.length > 0">
      <PaperCompositionQuestion
        v-for="(question, qIndex) in buffer.data"
        :key="question.number"
        :data="question"
        :selected="v_questionSelected(question)"
        v-update:config="questionConfig"
        @on-insert="vm_insertQuestion"
        @on-remove="vm_removeQuestion"
        @on-analyse="vm_onAnalysis"
        @on-open="vm_onOpenLabelModal"
      />
    </template>

    <QuestionAnalysisDialog
      :visible.sync="analysisDialog.active"
      :data="analysisDialog.data"
    />

    <PaperCompositionPanel
      v-if="questionConfig.select"
      :data="paper"
      v-update:config="panelConfig"
      @on-preview="$emit('on-preview')"
    />

    <!-- 收藏标签管理模态框 -->
    <label-modal
      :visible.sync="labelModal.active"
      :id="labelModal.id"
      :number="labelModal.number"
      v-model="labelModal.labelIds"
      @updateData="vm_fetchQuestionData"
    ></label-modal>

  </div>
</template>

<style lang="less">
@import './style/paper';

.paper-composition-assistance {
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
</style>
