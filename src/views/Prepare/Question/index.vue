<template>
  <div class="question-paper-composition">
    <!-- 左：树形搜索 -->
    <TreeSideSearch
      class="question-paper-composition__tree"
      :entries="treeEntries"
      @on-single-select="v_singleSelect"
    />

    <!-- 右：主体 -->
    <section>
      <!-- 上部：科目过滤 -->
      <ConditionRadioSubject
        v-if="subjects"
        :data="subjects.data"
        :default="subjects.default"
        @change="v_getPrecondition"
      />

      <!-- 上部：高级搜索 -->
      <ConditionRadio
        v-for="(condition, key) in advanceConditions"
        :key="key"
        :label="condition.label"
        :data="condition.data"
        :tag="`equal[${key}]`"
      />

      <!-- 下部：组卷 -->
      <PaperComposition
        :data="buffer"
        :paper.sync="paper"
        @on-preview="vm_onPaperPreview"
      />
    </section>

    <!-- 试卷预览 -->
    <PaperPreviewDialog
      :visible.sync="previewModal.visible"
      :data="paper"
      :loading="previewModal.loading"
      @on-ok="vm_createPaper"
    />
  </div>
</template>

<script>
/**
 * 题库中心 - 试卷 - 组卷中心
 *
 * @author huojinzhao
 */

import { list } from '@/mixins'
import { GLOBAL } from '@/store/mutationTypes'
import {
  ConditionRadio,
  ConditionRadioSubject,
  PaperComposition,
  PaperPreviewDialog,
  TreeSideSearch,
} from '@/views/components'

export default {
  name: 'question-paper-composition',

  mixins: [list],

  components: {
    ConditionRadioSubject,
    ConditionRadio,
    PaperComposition,
    PaperPreviewDialog,
    TreeSideSearch,
  },

  data: () => ({
    // server: 学科选择数据
    subjects: null,

    // server：树结构数据
    treeData: {
      // 知识点树
      knowledge_tree: [],

      // 章节树
      chapter_tree: [],
    },

    // server: 高级搜索数据
    advanceConditions: null,

    // server: 题目数据
    buffer: {},

    // 组卷试题数据
    paper: {
      grade_range_subject_id: null,
      places: [[]],
      grade: null,
      subject_type: null,
      paper_type: null,
      year: null,
      display_name: '',
      question_types: [],
    },

    previewModal: {
      visible: false,
      loading: false,
    },
  }),

  computed: {
    queryUrl() {
      const url = this.$route.fullPath
      const index = url.indexOf('?')
      return index > -1 ? url.slice(index) : ''
    },

    treeEntries() {
      return [
        {
          label: '按知识点',
          key: 'knowledge_id',
          data: this.treeData.knowledge_tree,
        },
        {
          label: '按章节',
          key: 'chapter_id',
          data: this.treeData.chapter_tree,
        },
      ]
    },
  },

  created() {
    const currentSubject = this.$route.query['equal[grade_range_subject_id]']
    this.v_getPrecondition(currentSubject)
  },

  methods: {
    /* --- Initialization --- */

    v_getPrecondition(subjectId) {
      // this.$route.meta.beforeUri
      const host = '/question_center/index_before'

      const url = subjectId
        ? `${host}?grade_range_subject_id=${subjectId}` : host

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
          chapter_tree,
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
          this.treeData = {
            knowledge_tree,
            chapter_tree,
          }

          this.m_generatePaper(
            subjectId || current_grade_range_subject_id,
            question_type_id.data,
          )
        })
    },

    // 生成试卷信息，变换学科，重置选题;
    m_generatePaper(currentSubject, types) {
      // 科目生成
      this.paper.grade_range_subject_id = currentSubject
      // 题型生成
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

    // 设置 score 字段，重置 id 字段为 question_id
    initQuestions(buffer) {
      const data = buffer.data.map(question => ({
        ...question,
        question_id: question.id,
        score: 0,
      }))
      return { ...buffer, ...{ data } }
    },

    v_singleSelect(key, id) {
      const fragment = id ? `equal[${key}]=${id}` : ''
      this.searchData(this.recombineQuery(fragment))
    },

    recombineQuery(fragment) {
      return this.queryUrl
        ? `?${this.queryUrl}&${fragment}`
        : `?${fragment}`
    },

    // 通过side-tree获取数据，无记忆
    searchData(queryUrl) {
      this.$store.commit(GLOBAL.LOADING.SHOW)
      this.getData(queryUrl)
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

    vm_onPaperPreview() {
      this.previewModal.visible = true
    },

    v_cancel() {
      this.$router.push('/prepare/papercenter')
    },

    /* --- Business --- */

    vm_createPaper(paper) {
      this.previewModal.loading = true

      this.$http.post('/paper_center', paper)
        .then(() => this.v_cancel())
        .catch(() => {
          this.$Notice.error({
            title: '创建试卷失败',
            duration: 0,
          })
          this.previewModal.loading = false
        })
    },
  },
}
</script>

<style lang="less">
@layout-width:    1160px;
@layout-padding:  10px;

.question-paper-composition {
  width: @layout-width;

  &__tree {
    margin-top: @layout-padding;
  }

  & > section {
    padding-left: 20px;
    overflow: hidden;
  }
}
</style>
