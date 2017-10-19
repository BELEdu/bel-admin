/**
 * 学员课程状态
 * @author zml | chenliangshan
 * @version 2017-10-12
 */

// 引入子模块
import student from './student'
import product from './product'
import classes from './classes'
import plan from './plan'
import schedule from './schedule'
import meeting from './meeting'
import warning from './warning'
import studyprogress from './studyprogress'
import knowledgepoint from './knowledgepoint'

export default {
  modules: {
    student,
    product,
    classes,
    plan,
    schedule,
    meeting,
    warning,
    studyprogress,
    knowledgepoint,
  },
}
