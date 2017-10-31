/**
 * 测试管理路由模块
 *
 * @author huojinzhao
 */

import * as views from '@/views'

/* 测试管理 */
const EXAMINATION = { name: '测试管理' }

/* 智能测试 */
const EXAMINATION_SMARTEXAM = {
  routeName: 'ExaminationSmartExam',
  name: '智能测试',
  link: '/examination/smartexam',
}
const EXAMINATION_SMARTEXAM_CHECK = {
  routeName: 'ExaminationSmartExamCheck',
  name: '阅卷',
  link: '/examination/smartexam/:testid/check',
}
const EXAMINATION_SMARTEXAM_PREVIEW = {
  routeName: 'ExaminationSmartExamPreview',
  name: '查看试卷',
  link: '/examination/smartexam/:testid/preview',
}

/* 错题管理 */
const EXAMINATION_WRONGQUESTION = {
  name: '错题管理',
  link: '/examination/wrongquestion',
}

export default [
  /* 智能测试 */

  // 测试列表
  {
    path: EXAMINATION_SMARTEXAM.link,
    name: EXAMINATION_SMARTEXAM.routeName,
    component: views.ExaminationSmartExam,
    meta: {
      breadcrumb: [
        EXAMINATION,
        EXAMINATION_SMARTEXAM,
      ],
    },
  },

  // 阅卷
  {
    path: EXAMINATION_SMARTEXAM_CHECK.link,
    name: EXAMINATION_SMARTEXAM_CHECK.routeName,
    component: views.ExaminationSmartExamCheck,
    meta: {
      breadcrumb: [
        EXAMINATION,
        EXAMINATION_SMARTEXAM,
        EXAMINATION_SMARTEXAM_CHECK,
      ],
    },
  },

  // 查看试卷
  {
    path: EXAMINATION_SMARTEXAM_PREVIEW.link,
    name: EXAMINATION_SMARTEXAM_PREVIEW.routeName,
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

  // 列表页
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

  // 分析详情
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
