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
const QUESTION_CHAPTER = {
  name: '章节',
  link: '/question/chapter',
}
const QUESTION_QUESTION = {
  name: '试题',
  link: '/question/question',
}
const QUESTION_PAPER = {
  name: '试卷',
  link: '/question/paper',
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
  // 试卷
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
]
