<template>
   <div class="question-paper-composition">
    <!-- 插槽 学员信息 -->
    <slot
      name="header"
      :data="buffer"
    ></slot>

    <!-- 左：树形搜索 -->
    <TreeCondition
      v-if="treeEntries"
      class="question-paper-composition__tree"
      :entries="treeEntries"
    />

    <!-- 右：主体 -->
    <section>
      <!-- 上部：科目过滤 -->
      <ConditionRadioQuery
        v-if="subjects"
        :data="subjects.data"
        :default="subjects.default"
        @change="value => vm_fetchBefore(value)"
        readOnly
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
        :buffer="buffer"
        :paper.sync="paper"
        :panel-config="{ title: '加入试题' }"
        :question-config="{ select: true, carrier: '试题' }"
        @on-preview="v_selecteCompleted"
      />
    </section>
  </div>
</template>

<script>
/**
 * 备课管理 - 教案 - 换题
 *
 * @author huojinzhao
 *
 * @desc questionTypesSupply    接数据
 * @desc questionTypesFeedback  给数据
 */

import { GLOBAL } from '@/store/mutationTypes'
import {
  ConditionRadio,
  ConditionRadioQuery,
  PaperComposition,
  TreeCondition,
} from '@/views/components'

const paperFactory = () => ({
  grade_range_subject_id: null,
  campuses: [[]],
  grade: null,
  subject_type: null,
  paper_type: null,
  year: null,
  display_name: '',
  exam_time: 0,
  question_types: [],
})

export default {
  name: 'PreparePrepareplanQuestion',

  components: {
    ConditionRadioQuery,
    ConditionRadio,
    PaperComposition,
    TreeCondition,
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
    buffer: { data: [] },

    // 组卷试题数据
    paper: paperFactory(),

    treeEntries: null,
  }),

  computed: {
    subjectID() {
      const id = this.$route.query['equal[grade_range_subject_id]']
        || (this.subjects ? this.subjects.data[0].value : '')

      return parseInt(id, 10)
    },
  },

  created() {
    this.initCreation()
  },

  beforeRouteUpdate(to, from, next) {
    next()
    this.m_fetchData(to)
  },

  methods: {
    initCreation() {
      this.m_fetchData()
        .then(() => this.initPaper())
        .catch(() => {
          this.$Notice.error({
            title: '无法访问数据，请稍后再试',
            duration: 0,
          })
        })
    },

    initPaper() {
      const temp = localStorage.getItem('questionTypesSupply')
      const data = JSON.parse(temp)
      this.paper.question_types = this.sectionsUpdation(data)
    },

    sectionsUpdation(sections) {
      return this.paper.question_types
        .map((type) => {
          const target = type.question_type_id

          const section = sections
            .find(({ question_type_id }) => question_type_id === target)

          return { ...type, ...section } || type
        })
    },

    getBeforeUrl(subjectID) {
      const host = this.$route.meta.beforeUri

      return subjectID
        ? `${host}?grade_range_subject_id=${subjectID}`
        : host
    },

    vm_fetchBefore(subjectID = this.subjectID) {
      const url = this.getBeforeUrl(subjectID)

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

          this.treeData = {
            knowledge_tree,
            chapter_tree,
            user_label_list,
          }

          this.m_initTreeEntries()

          this.m_generatePaper(
            this.subjectID,
            question_type_id.data,
          )
        })
    },

    // 生成试卷结构数据
    m_generatePaper(subjectID, types) {
      // 题型生成
      this.paper.question_types = types
        .map(type => ({
          question_type_id: type.id,
          display_name: type.display_name,
          best_score: 0,
          questions: [],
        }))
    },

    m_initTreeEntries() {
      this.treeEntries = []

      if (this.treeData.user_label_list) {
        this.treeEntries.push({
          label: '按我的标签',
          key: 'equal[user_label_id]',
          tree: this.treeData.user_label_list,
          selectedLeafId: '',
        })
      }

      if (this.treeData.knowledge_tree) {
        this.treeEntries.push({
          label: '按知识点',
          key: 'equal[knowledge_id]',
          tree: this.treeData.knowledge_tree,
          selectedLeafId: '',
        })
      }

      if (this.treeData.chapter_tree) {
        this.treeEntries.push({
          label: '按章节',
          key: 'equal[chapter_id]',
          tree: this.treeData.chapter_tree,
          selectedLeafId: '',
        })
      }
    },

    m_fetchData(route = this.$route) {
      this.$store.commit(GLOBAL.LOADING.SHOW)

      return this.getData(this.getQueryUrl(route.query))
        .catch(() => {
          this.$Notice.error({
            title: '无法访问试题数据，请稍后再试',
            duration: 0,
          })
        })
        .then(() => {
          this.$store.commit(GLOBAL.LOADING.HIDE)
        })
    },

    getData(query) {
      const asyncFlow = this.subjects && query
        ? Promise.resolve()
        : this.vm_fetchBefore()

      return asyncFlow
        .then(() => (
          query
            ? this.m_getData(query)
            : this.$router.push(this.m_resetSearchField())
        ))
    },

    m_getData(query) {
      const host = this.$route.meta.fetchUri

      const url = `${host}${query}&per_page=20`

      return this.$http.get(url)
        .then((res) => {
          // 和PrepareQuestion不一样
          // 后者题目初始化 question_id = id 是在Preview中进行的
          // 后期调整，应该在Compositon中进行
          res.data.forEach((item) => {
            // eslint-disable-next-line
            item.question_id = item.id
          })
          this.buffer = res
        })
    },

    m_resetSearchField() {
      const subject = `equal[grade_range_subject_id]=${this.subjects.data[0].value}`

      return `${this.$route.path}?${subject}`
    },

    getQueryUrl(query) {
      const url = Object.keys(query).reduce((
        acc,
        val,
        index,
      ) => {
        const separator = index === 0 ? '?' : '&'
        return `${acc}${separator}${val}=${query[val]}`
      }, '')

      return url
    },

    v_selecteCompleted() {
      const data = this.paper.question_types
        .filter(type => type.questions.length)

      const questions = JSON.stringify(data)

      localStorage.setItem('questionTypesFeedback', questions)
    },
  },
}
</script>

<style lang="less">
@layout-width:    1116px;
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
