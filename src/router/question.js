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

const QUESTION_PAPER_DETAIL = {
  name: '试卷详情',
  link: '/question/paper/:id',
}

const QUESTION_PAPER_CREATION_COMPOSITION = {
  name: '组卷',
  link: '/question/paper/composition',
}

const QUESTION_PAPER_EDITION_COMPOSITION = {
  name: '组卷',
  link: '/question/paper/composition/:id',
}

const QUESTION_PAPER_CREATION = {
  name: '生成试卷',
  link: '/question/paper/creation',
}

const QUESTION_PAPER_EDITION = {
  name: '编辑试卷',
  link: '/question/paper/creation/:id',
}

export default [
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
  // 章节
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
  // 试题
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
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_PAPER,
      ],
    },
  },

  // 组卷页 - 新建
  {
    path: QUESTION_PAPER_CREATION_COMPOSITION.link,
    name: 'QuestionPaperComposition',
    component: views.QuestionPaperComposition,
    meta: {
      source: 'paperCompose',
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
    name: 'QuestionPaperComposition',
    component: views.QuestionPaperComposition,
    meta: {
      source: 'paperCompose',
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_PAPER,
        QUESTION_PAPER_EDITION_COMPOSITION,
      ],
    },
  },

  // 生成试卷页 - 新建
  {
    path: QUESTION_PAPER_CREATION.link,
    name: 'QuestionPaperCreation',
    component: views.QuestionPaperCreation,
    meta: {
      source: 'paperCompose',
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_PAPER,
        QUESTION_PAPER_CREATION_COMPOSITION,
        QUESTION_PAPER_CREATION,
      ],
    },
  },

  // 生成试卷页 - 编辑
  {
    path: QUESTION_PAPER_EDITION.link,
    name: 'QuestionPaperEdition',
    component: views.QuestionPaperCreation,
    meta: {
      source: 'paperCompose',
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_PAPER,
        QUESTION_PAPER_EDITION_COMPOSITION,
        QUESTION_PAPER_EDITION,
      ],
    },
  },

  // 试卷详情页
  {
    path: QUESTION_PAPER_DETAIL.link,
    name: 'QuestionPaperDetail',
    component: views.QuestionPaperDetail,
    meta: {
      breadcrumb: [
        { name: '题库中心' },
        QUESTION_PAPER,
        QUESTION_PAPER_DETAIL,
      ],
    },
  },

]
