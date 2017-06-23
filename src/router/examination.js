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
} from '@/views'

export default [
  {
    path: '/examination/smartanalyse',
    component: SmartAnalyse,
  },
  {
    path: '/examination/smartanalyse/:id',
    component: StudentAnalyse,
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
