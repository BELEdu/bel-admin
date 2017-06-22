/**
 * 测试管理路由模块
 * @author hjz
 * @version 2017-06-22
 * @description
 */
import { SmartAnalyse, SmartExam, WrongQuestion } from '@/views'

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
    path: '/examination/wrongquestion',
    component: WrongQuestion,
  },
]
