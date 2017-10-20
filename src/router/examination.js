/**
 * 测试管理路由模块
 * @author hjz
 * @version 2017-06-22
 * @description
 */
import {
  ExaminationSmartExam,
  ExaminationSmartExamCheck,
  SmartAnalyse,
  StudentAnalyse,
  WrongQuestion,
  StudentWrong,
} from '@/views'

const EXAMINATION = { name: '测试管理' }
const EXAMINATION_SMARTEXAM = { name: '智能测试', link: '/examination/smartexam' }
const EXAMINATION_SMARTEXAM_CHECK = { name: '阅卷', link: '/examination/smartexam/:id' }

export default [
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
  {
    path: '/examination/wrongquestion',
    component: WrongQuestion,
    meta: {
      breadcrumb: [
        { name: '测试管理' },
        { name: '错题管理' },
      ],
    },
  },
  {
    path: '/examination/wrongquestion/:id',
    component: StudentWrong,
    meta: {
      breadcrumb: [
        { name: '测试管理' },
        { name: '错题管理' },
        { name: '错题库' },
      ],
    },
  },
]
