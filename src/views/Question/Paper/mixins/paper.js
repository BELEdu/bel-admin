/**
 * 组卷页面&编辑试卷 数据存储
 *
 * @author  huojinzhao
 * @desc    只有组卷和编辑切换时，进入时readStore，离开时store
 * @desc    只有非vue应用进入时才读catch
 */

import { QUESTION } from '@/store/mutationTypes'

const { PAPER } = QUESTION

export default {
  data: () => ({
    from: {},

    paper: {
      campuses: [[]],
      grade: null,
      subject_type: null,
      paper_type: null,
      year: null,
      display_name: '',
      exam_time: 0,
      question_types: [],
    },
  }),

  computed: {
    currentSubjectId() {
      return parseInt(this.$route.query['equal[grade_range_subject_id]'], 10)
    },

    currentSubject() {
      return `equal[grade_range_subject_id]=${this.currentSubjectId}`
    },
  },

  methods: {
    storePaper() {
      this.$store.commit(PAPER.COMPOSE, { ...this.paper })
    },

    readPaperStore() {
      this.paper = { ...this.$store.state.question.paper.paper }
    },

    recordPaper() {
      this.storePaper()
      this.$store.commit(PAPER.RECORD)
    },
  },

  beforeRouteEnter(to, from, next) {
    const subjectId = to.query['equal[grade_range_subject_id]']
    next((vm) => {
      // 读取预备数据，注意预备数据会重置question_type
      // 所以memory逻辑才放到then中执行
      vm.getPrecondition(subjectId)
        .then(() => {
          // 非vue应用进入读localStorage
          if (
            !from.name
          ) {
            vm.$store.commit(PAPER.RELOAD)
          }
          // 组卷和编辑切换、刷新页面重载读store
          if (
            !from.name
            || from.meta.source === 'paperCompose'
          ) {
            vm.readPaperStore()
          }
        })
      // 是否从列表页过来
      if (vm.initEdition) vm.initEdition(from)
    })
  },

  created() {
    // 刷新页面，强缓存
    window.addEventListener('unload', this.recordPaper)
  },

  beforeRouteLeave(to, from, next) {
    // 组卷和编辑切换，store
    if (to.meta.source === 'paperCompose') {
      this.storePaper()
    }
    next()
  },

  beforeDestroy() {
    window.removeEventListener('unload', this.recordPaper)
  },
}
