/**
 * 测试管理路由模块
 *
 * @author huojinzhao
 */
import {
  ExaminationSmartExam,
  ExaminationSmartExamCheck,
  SmartAnalyse,
  StudentAnalyse,
  ExaminationWrongQuestion,
  ExaminationWrongQuestionDetail,
} from '@/views'

const EXAMINATION = { name: '测试管理' }

const EXAMINATION_SMARTEXAM = {
  name: '智能测试',
  link: '/examination/smartexam',
}

const EXAMINATION_SMARTEXAM_CHECK = {
  name: '阅卷',
  link: '/examination/smartexam/:id',
}

const EXAMINATION_WRONGQUESTION = {
  name: '错题管理',
  link: '/examination/wrongquestion',
}

export default [
  /* 智能测试 */

  {
    path: EXAMINATION_SMARTEXAM.link,
    component: ExaminationSmartExam,
    meta: {
      breadcrumb: [
        EXAMINATION,
        EXAMINATION_SMARTEXAM,
      ],
    },
  },
  {
    path: EXAMINATION_SMARTEXAM_CHECK.link,
    component: ExaminationSmartExamCheck,
    meta: {
      breadcrumb: [
        EXAMINATION,
        EXAMINATION_SMARTEXAM,
        EXAMINATION_SMARTEXAM_CHECK,
      ],
    },
  },

  /* abolish 智能分析 */

  {
    path: '/examination/smartanalyse',
    component: SmartAnalyse,
    meta: {
      breadcrumb: [
        { name: '测试管理' },
        { name: '智能分析' },
      ],
    },
  },
  {
    path: '/examination/smartanalyse/:id',
    component: StudentAnalyse,
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
    component: ExaminationWrongQuestion,
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
    component: ExaminationWrongQuestionDetail,
    meta: {
      breadcrumb: [
        { name: '测试管理' },
        EXAMINATION_WRONGQUESTION,
        { name: '错题库' },
      ],
    },
  },
]
