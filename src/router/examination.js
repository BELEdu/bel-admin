/**
 * 测试管理路由模块
 * @author hjz
 * @version 2017-06-22
 * @description
 */
import {
  SmartExam,
  StudentExam,
  SmartAnalyse,
  StudentAnalyse,
  WrongQuestion,
  StudentWrong,
} from '@/views'

export default [
  {
    path: '/examination/smartexam',
    component: SmartExam,
    meta: {
      breadcrumb: [
        { name: '测试管理' },
        { name: '智能测试' },
      ],
    },
  },
  {
    path: '/examination/smartexam/:id',
    component: StudentExam,
    meta: {
      breadcrumb: [
        { name: '测试管理' },
        { name: '智能测试' },
        { name: '学员测试' },
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
