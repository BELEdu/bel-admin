/**
 * 测试管理路由模块
 * @author hjz
 * @version 2017-06-22
 * @description
 */
import {
  SmartAnalyse,
  SmartExam,
  StudentExam,
  WrongQuestion,
} from '@/views'

export default [
  {
    path: '/examination/smartanalyse',
    component: SmartAnalyse,
  },
  {
    path: '/examination/smartexam',
    component: SmartExam,
  },
  {
    path: '/examination/smartexam/:id',
    component: StudentExam,
  },
  {
    path: '/examination/wrongquestion',
    component: WrongQuestion,
  },
]
