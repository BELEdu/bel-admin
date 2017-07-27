/**
 * 模块监听窗口变化
 * @author chenliangshan
 * @version 2017/07/27
 */


import { debounce } from 'lodash'

export default {
  created() {
    window.addEventListener('resize', debounce(this.resize, 500))
  },
  beforeDestroy() {
    window.removeEventListener('resize', debounce(this.resize, 500))
  },
}
