/**
 * Echarts注册
 * @author chenliangshan
 * @version 2017/07/27
 */

import echarts from 'echarts'

export default {
  data() {
    return {
      echartDom: {},
    }
  },
  mounted() {
    this.echartDom = echarts.init(this.$refs.module)
    this.echartDom.setOption(this.echartOption)
  },
  methods: {
    resize() {
      this.echartDom.resize()
    },
  },
}
