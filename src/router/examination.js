/**
 * 测试管理路由模块
 *
 * @author huojinzhao
 */

import * as views from '@/views'

const EXAMINATION = { name: '测试管理' }

const EXAMINATION_SMARTEXAM = {
  name: '智能测试',
  link: '/examination/smartexam',
}

const EXAMINATION_SMARTEXAM_CHECK = {
  name: '阅卷',
  link: '/examination/smartexam/:testid/check',
}
const EXAMINATION_SMARTEXAM_PREVIEW = {
  name: '查看试卷',
  link: '/examination/smartexam/:testid/preview',
}

const EXAMINATION_WRONGQUESTION = {
  name: '错题管理',
  link: '/examination/wrongquestion',
}

export default [
  /* 智能测试 */

  {
    path: EXAMINATION_SMARTEXAM.link,
    component: views.ExaminationSmartExam,
    meta: {
      breadcrumb: [
        EXAMINATION,
        EXAMINATION_SMARTEXAM,
      ],
    },
  },
  {
    path: EXAMINATION_SMARTEXAM_CHECK.link,
    component: views.ExaminationSmartExamCheck,
    meta: {
      breadcrumb: [
        EXAMINATION,
        EXAMINATION_SMARTEXAM,
        EXAMINATION_SMARTEXAM_CHECK,
      ],
    },
  },
  {
    path: EXAMINATION_SMARTEXAM_PREVIEW.link,
    component: views.ExaminationSmartExamPreview,
    meta: {
      breadcrumb: [
        EXAMINATION,
        EXAMINATION_SMARTEXAM,
        EXAMINATION_SMARTEXAM_PREVIEW,
      ],
    },
  },

  /* abolish 智能分析 */

  {
    path: '/examination/smartanalyse',
    component: views.SmartAnalyse,
    meta: {
      breadcrumb: [
        { name: '测试管理' },
        { name: '智能分析' },
      ],
    },
  },
  {
    path: '/examination/smartanalyse/:id',
    component: views.StudentAnalyse,
    meta: {
      breadcrumb: [
        { name: '测试管理' },
        { name: '智能分析' },
        { name: '分析详情' },
      ],
    },
  },

  /* 错题管理 */

  // 列表页
  {
    path: EXAMINATION_WRONGQUESTION.link,
    component: views.ExaminationWrongQuestion,
    meta: {
      uri: '/wrongquestion',
      breadcrumb: [
        { name: '测试管理' },
        EXAMINATION_WRONGQUESTION,
      ],
    },
  },

  // 学员错题详情
  {
    path: '/examination/wrongquestion/:id',
    component: views.ExaminationWrongQuestionDetail,
    meta: {
      fetchUri: '钩子中生成',
      breadcrumb: [
        { name: '测试管理' },
        EXAMINATION_WRONGQUESTION,
        { name: '错题库' },
      ],
    },
    beforeEnter(to, from, next) {
      const id = to.params.id
      // eslint-disable-next-line
      to.meta.fetchUri = `/wrongquestion/wrong_list/${id}`
      next()
    },
  },
]
