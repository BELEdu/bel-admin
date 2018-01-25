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
        @change="value => vm_fetchBefore({ subjectID: value })"
      />

      <!-- 上部：教材过滤 -->
      <ConditionRadioQuery
        v-if="teachMaterials"
        :data="teachMaterials.data"
        :default="teachMaterials.default"
        label="教材"
        tag="equal[teach_materials]"
        spread
        @change="value => vm_fetchBefore({ teachMaterialsID: value })"
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
        v-bind="$attrs"
        :buffer="buffer"
        :paper.sync="paper"
        @on-preview="vm_onPaperPreview"
      />

      <!-- 插槽 题目扩展 -->
      <slot
        name="improvement"
        :data="buffer.data"
      ></slot>
    </section>

    <!-- 试卷预览 -->
    <PaperPreviewDialog
      :visible.sync="previewModal.visible"
      :data="paper"
      :loading="previewModal.loading"
      @on-ok="vm_createPaper"
      @on-close="paperVisible = false"
    />
  </div>
</template>

<script>
/**
 * 题库中心 - 试卷 - 组卷中心
 *
 * @author huojinzhao
 */

import { lastRecord } from '@/mixins'
import { GLOBAL } from '@/store/mutationTypes'
import ConditionRadio from './ConditionRadio'
import ConditionRadioQuery from './ConditionRadioQuery'
import PaperComposition from './PaperComposition'
import PaperPreviewDialog from './PaperPreviewDialog'
import TreeCondition from './TreeCondition'

// 组卷试题初始化数据
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
  // 前端视图拼凑试卷标题附加数据
  subjectName: '',
})

export default {
  name: 'ThePaper',

  mixins: [lastRecord],

  components: {
    ConditionRadioQuery,
    ConditionRadio,
    PaperComposition,
    PaperPreviewDialog,
    TreeCondition,
  },

  inheritAttrs: false,

  data: () => ({
    // server: 学科选择数据
    subjects: null,

    // server: 教材筛选数据
    teachMaterials: null,

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

    previewModal: {
      visible: false,
      loading: false,
    },

    treeEntries: null,
  }),

  computed: {
    // 当前学科id
    subjectID() {
      const id = this.$route.query['equal[grade_range_subject_id]']
        || this.getLastRecord('subject_id')
        || (this.subjects ? this.subjects.data[0].value : '')

      return parseInt(id, 10)
    },

    // 当前教材id
    teachMaterialsID() {
      const id = this.$route.query['equal[teach_materials]']
        || (this.teachMaterials ? this.teachMaterials.data[0].value : '')

      return parseInt(id, 10)
    },
  },

  beforeRouteEnter(to, from, next) {
    const { action } = to.meta

    next((vm) => {
      if (action === 'patch') {
        vm.initUpdation()
      } else {
        vm.initCreation()
      }
    })
  },

  beforeRouteUpdate(to, from, next) {
    next()
    this.m_fetchData(to)
  },

  beforeRouteLeave(to, from, next) {
    this.paper = paperFactory()
    next()
  },

  methods: {
    /* --- Initialization --- */

    /* Common */

    getBeforeUrl(subjectID, teachMaterialsID) {
      const host = this.$route.meta.beforeUri

      const subject = subjectID
        ? `?grade_range_subject_id=${subjectID}` : ''

      const symbol = subjectID ? '&' : '?'

      const teachMaterials = teachMaterialsID
        ? `${symbol}teach_materials=${teachMaterialsID}` : ''

      return `${host}${subject}${teachMaterials}`
    },

    vm_fetchBefore({
      subjectID = this.subjectID,
      teachMaterialsID = '',
    } = {}) {
      const url = this.getBeforeUrl(subjectID, teachMaterialsID)

      return this.$http.get(url)
        .then(({
          // 高级搜索
          current_grade_range_subject_id,
          grade_range_subject_id,
          current_teach_materials,
          teach_materials,
          question_type_id,
          paper_type,
          question_difficulty,
          // 树结构数据
          knowledge_tree,
          chapter_tree,
          user_label_list,
        }) => {
          // 设置默认行为数据
          this.setLastRecord('subject_id', current_grade_range_subject_id)

          this.subjects = {
            data: grade_range_subject_id,
            default: current_grade_range_subject_id,
          }

          this.teachMaterials = teach_materials
            ? {
              data: teach_materials.data,
              default: current_teach_materials,
            }
            : null

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

          // 初始化侧边栏树结构
          this.m_initTreeEntries()

          // eslint-disable-next-line
          !teachMaterialsID && this.m_generatePaper(
            this.subjectID,
            question_type_id.data,
          )
        })
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

    // 生成试卷信息，变换学科，重置选题;
    m_generatePaper(subjectID, types) {
      this.paper = paperFactory()
      // 科目生成
      this.paper.grade_range_subject_id = subjectID
      // 视图学科数据生成
      this.paper.subjectName = this.filterSubjectName(subjectID)
      // 题型生成
      this.paper.question_types = types
        .map(type => ({
          question_type_id: type.id,
          display_name: type.display_name,
          best_score: 0,
          questions: [],
          // 后端给的字段是score，有歧义，描述不准确
          questionDefaultScore: type.score,
        }))
    },

    m_fetchData(route = this.$route) {
      this.$store.commit(GLOBAL.LOADING.SHOW)

      return this.getData(this.getQueryUrl(route.query))
        .catch(() => this.$Notice.error({
          title: '无法访问试题数据，请稍后再试',
          duration: 0,
        }))
        .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
    },

    // 获取数据前置检测
    getData(query) {
      const asyncFlow = this.subjects && query
        ? Promise.resolve()
        : this.vm_fetchBefore()

      // 重定向前置query
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
        .then((res) => { this.buffer = res })
    },

    m_resetSearchField() {
      const subject = `equal[grade_range_subject_id]=${this.getLastRecord('subject_id') || this.subjects.data[0].value}`

      const materials = this.teachMaterials
      const teach = materials
        ? `equal[teach_materials]=${materials.data[0].value}` : ''

      const path = teach
        ? `${this.$route.path}?${subject}&${teach}`
        : `${this.$route.path}?${subject}`

      return path
    },

    /* Creation */

    // 创建试卷操作的初始化
    initCreation() {
      this.m_fetchData()
    },

    /* Edition */

    // 更新试卷操作的初始化
    initUpdation() {
      this.fetchUpdationInfo()
        .then(res => this.m_dealUpdationInfo(res))
        .catch(() => {
          this.$Notice.error({
            title: '无法访问试卷数据，请稍后再试',
            duration: 0,
          })
        })
    },

    // 先获取试卷数据
    fetchUpdationInfo() {
      return this.$http.get(this.$route.meta.submitUri)
    },

    m_dealUpdationInfo(paper) {
      const id = paper.grade_range_subject_id

      this.m_fetchData()
        .then(() => {
          this.paper = this.paperUpdation(paper)
          // 视图学科数据生成
          this.paper.subjectName = this.filterSubjectName(id)
          this.vm_onPaperPreview()
        })
    },

    // 请求回来的试卷数据并入本地试卷数据
    paperUpdation(paper) {
      const question_types = this.sectionsUpdation(paper.question_types)

      return { ...this.paper, ...paper, question_types }
    },

    sectionsUpdation(sections) {
      return this.paper.question_types
        .map((type) => {
          const target = type.question_type_id

          const section = sections
            .find(({ question_type_id }) => question_type_id === target)

          return section || type
        })
    },

    /* --- Assitance --- */

    // 生成试卷预览标题“学科”片段
    filterSubjectName(id) {
      const name = this.subjects.data
        .find(subject => subject.id === id)

      return name ? name.display_name.slice(2) : ''
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

    /* --- Control--- */

    vm_onPaperPreview() {
      this.previewModal.visible = true
    },

    v_complete() {
      const query = `equal[grade_range_subject_id]=${this.subjectID}`
      this.$router.push(`${this.$route.meta.backRoute}?${query}`)
    },

    /* --- Business --- */

    vm_createPaper(paper) {
      this.previewModal.loading = true

      const { action, submitUri } = this.$route.meta

      this.$http[action](submitUri, paper)
        .then(() => this.v_complete())
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
