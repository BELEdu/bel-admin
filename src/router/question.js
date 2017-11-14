/**
 * 题库中心路由设置
 *
 * @author huojinzhao
 */

import * as views from '@/views'

const QUESTION_KNOWLEDGE = {
  name: '知识点',
  link: '/question/knowledge',
}

const QUESTION_KNOWLEDGE_EDITION = {
  name: '编辑知识点',
  link: '/question/knowledge/edition/:id',
}

const QUESTION_CHAPTER = {
  name: '章节',
  link: '/question/chapter',
}

const QUESTION_QUESTION = {
  name: '试题',
  link: '/question/question',
}
const QUESTION_QUESTION_ADD = {
  name: '添加试题',
  link: '/question/question/:subject',
}
const QUESTION_QUESTION_EDIT = {
  name: '编辑试题',
  link: '/question/question/:subject/:id',
}

const QUESTION_PAPER = {
  name: '试卷',
  link: '/question/paper',
}

const QUESTION_PAPER_REPORT = {
  name: '报告配置',
  link: '/question/paper/report/:id',
}

const QUESTION_PAPER_DETAIL = {
  name: '试卷详情',
  link: '/question/paper/:id',
}

const QUESTION_PAPER_CREATION_COMPOSITION = {
  name: '组卷',
  link: '/question/paper/composition',
}

const QUESTION_PAPER_EDITION_COMPOSITION = {
  name: '编辑试卷',
  link: '/question/paper/composition/:id',
}

export default [

  /* --- 知识点 --- */

  // 知识点
  {
    path: QUESTION_KNOWLEDGE.link,
    name: 'QuestionKnowledge',
    component: views.QuestionKnowledge,
    meta: {
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_KNOWLEDGE,
      ],
    },
  },

  // 编辑知识点
  {
    path: QUESTION_KNOWLEDGE_EDITION.link,
    name: 'QuestionKnowledgeEdtition',
    component: views.QuestionKnowledgeEdition,
    meta: {
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_KNOWLEDGE,
        QUESTION_KNOWLEDGE_EDITION,
      ],
    },
  },

  /* --- 章节 --- */

  // 章节列表
  {
    path: QUESTION_CHAPTER.link,
    name: 'QuestionChapter',
    component: views.QuestionChapter,
    meta: {
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_CHAPTER,
      ],
    },
  },

  /* --- 试题 --- */

  // 试题列表
  {
    path: QUESTION_QUESTION.link,
    name: 'QuestionQuestion',
    component: views.QuestionQuestion,
    meta: {
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_QUESTION,
      ],
    },
  },

  // 添加试题
  {
    path: QUESTION_QUESTION_ADD.link,
    name: 'QuestionQuestionAdd',
    component: views.QuestionQuestionEdit,
    meta: {
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_QUESTION,
        QUESTION_QUESTION_ADD,
      ],
    },
  },

  // 编辑试题
  {
    path: QUESTION_QUESTION_EDIT.link,
    name: 'QuestionQuestionEdit',
    component: views.QuestionQuestionEdit,
    meta: {
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_QUESTION,
        QUESTION_QUESTION_EDIT,
      ],
    },
  },

  /* --- 试卷 --- */

  // 试卷列表页
  {
    path: QUESTION_PAPER.link,
    name: 'QuestionPaper',
    component: views.QuestionPaper,
    meta: {
      uri: '/paper',
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_PAPER,
      ],
    },
  },

  // 试卷报告配置页
  {
    path: QUESTION_PAPER_REPORT.link,
    name: 'QuestionPaperReport',
    component: views.QuestionPaperReport,
    meta: {
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_PAPER,
        { name: '报告配置' },
      ],
    },
  },

  // 组卷页 - 新建
  {
    path: QUESTION_PAPER_CREATION_COMPOSITION.link,
    name: 'QuestionPaperCompositionCreation',
    component: views.PrepareQuestion,
    meta: {
      action: 'post',
      beforeUri: '/question/for_paper_before',
      fetchUri: '/question/for_paper',
      submitUri: '/paper',
      backRoute: '/question/paper',
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_PAPER,
        QUESTION_PAPER_CREATION_COMPOSITION,
      ],
    },
  },

  // 组卷页 - 编辑
  {
    path: QUESTION_PAPER_EDITION_COMPOSITION.link,
    name: 'QuestionPaperCompositionUpdation',
    component: views.PrepareQuestion,
    meta: {
      action: 'patch',
      beforeUri: '/question/for_paper_before',
      fetchUri: '/question/for_paper',
      submitUri: '钩子中生成',
      backRoute: '/question/paper',
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_PAPER,
        QUESTION_PAPER_EDITION_COMPOSITION,
      ],
    },
    beforeEnter(to, from, next) {
      // eslint-disable-next-line
      to.meta.submitUri = `/paper/${to.params.id}`
      next()
    },
  },

  // 试卷详情页
  {
    path: QUESTION_PAPER_DETAIL.link,
    name: 'QuestionPaperDetail',
    component: views.QuestionPaperDetail,
    meta: {
      uri: '/paper',
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_PAPER,
        QUESTION_PAPER_DETAIL,
      ],
    },
  },
]
