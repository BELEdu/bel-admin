/**
 * 学员课程状态
 * @author zml
 * @version 2017-06-20
 * @version 2017-07-06
 */

// 引入子模块
import student from './student'
import product from './product'
import classes from './classes'
import meeting from './meeting'
import warning from './warning'
import studyprogress from './studyprogress'
import knowledgepoint from './knowledgepoint'

export default {
  modules: {
    student,
    product,
    classes,
    meeting,
    warning,
    studyprogress,
    knowledgepoint,
  },
}
