/**
 * 学员管理状态
 * @author zml
 * @version 2017-06-20
 */

// 引入子模块
import student from './student'
import classes from './classes'
import meeting from './meeting'
import warning from './warning'

export default {
  modules: {
    student,
    classes,
    meeting,
    warning,
  },
}
