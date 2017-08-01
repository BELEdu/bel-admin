/**
 * 实现Vue1.x $broadcast事件广播方法
 * @author  chenliangshan
 * @version 2017/08/01
 */
import { broadcast } from '@/utils'

export default {
  methods: {
    // 事件广播
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    },
  },
}
