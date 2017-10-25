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

const EXAMINATION_SMARTEXAM_DETAIL = {
  name: '测试主组件',
  link: '/examination/smartexam/:testid',
}

const EXAMINATION_SMARTEXAM_DETAIL_CHECK = {
  name: '阅卷',
  link: '/examination/smartexam/:testid/check',
}

const EXAMINATION_SMARTEXAM_DETAIL_CHECK_PAPER = {
  name: '阅卷',
  link: '/examination/smartexam/:testid/check/:id',
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
    path: EXAMINATION_SMARTEXAM_DETAIL.link,
    component: views.ExaminationSmartExamDetail,
    meta: {
      breadcrumb: [
        EXAMINATION,
        EXAMINATION_SMARTEXAM,
        EXAMINATION_SMARTEXAM_DETAIL,
      ],
    },
    children: [
      {
        path: EXAMINATION_SMARTEXAM_DETAIL_CHECK.link,
        component: views.ExaminationSmartExamDetailCheck,
        meta: {
          breadcrumb: [
            EXAMINATION,
            EXAMINATION_SMARTEXAM,
            EXAMINATION_SMARTEXAM_DETAIL_CHECK,
          ],
        },
        children: [
          {
            path: EXAMINATION_SMARTEXAM_DETAIL_CHECK_PAPER.link,
            component: views.QuestionPaperDetail,
            meta: {
              uri: '/test/paperinspection',
              breadcrumb: [
                EXAMINATION,
                EXAMINATION_SMARTEXAM,
                EXAMINATION_SMARTEXAM_DETAIL_CHECK_PAPER,
              ],
            },
          },
        ],
      },
    ],
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
      breadcrumb: [
        { name: '测试管理' },
        EXAMINATION_WRONGQUESTION,
        { name: '错题库' },
      ],
    },
  },
]
