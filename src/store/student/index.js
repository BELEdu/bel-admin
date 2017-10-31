/**
 * 学员课程状态
 * @author zml | chenliangshan
 * @version 2017-10-12
 */

// 引入子模块
import student from './student'
import classes from './classes'
import plan from './plan'
import schedule from './schedule'
import meeting from './meeting'

export default {
  modules: {
    student,
    classes,
    plan,
    schedule,
    meeting,
  },
}
