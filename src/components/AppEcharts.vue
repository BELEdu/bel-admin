<template>
  <div class="app-echarts" :id="id" :style="style"></div>
</template>

<script>
  /**
   * echarts图表组件
   * @author  chenliangshan
   * @version 2017/07/28
   */

  import echarts from 'echarts'
  import { debounce } from 'lodash'

  export default {
    name: 'app-echarts',
    data() {
      return {
        // 保存地图初始化的实例
        chart: '',
        resize: null,
      }
    },
    props: {
      id: {
        type: String,
        default() {
          // 生成一个随机字符串
          return `app-echarts__${Math.random().toString(36).substring(3, 8)}`
        },
      },
      // 图表高度
      height: {
        type: String,
        default: '100%',
      },
      // 图表宽度
      width: {
        type: String,
        default: '100%',
      },
      setOption: {
        type: Object,
        default() {
          return null
        },
      },
      delayTime: {
        type: Number,
        default: 500,
      },
    },

    computed: {
      style() {
        return {
          height: this.height,
          width: this.width,
        }
      },
      setOptions() {
        return this.setOption
      },
    },
    mounted() {
      // 初始化图表
      this.init()
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize)
      if (this.char) {
        // 销毁图表实例
        this.chart.dispose()
      }
    },
    methods: {
      // 初始化图表
      init() {
        this.chart = echarts.init(document.getElementById(this.id))
        this.chart.setOption(this.setOptions)
        this.resize = debounce(this.chartResize, this.delayTime)
        // 图表响应大小的关键,重绘
        window.addEventListener('resize', this.resize)
      },
      // 重绘图表
      chartResize() {
        this.chart.resize()
      },
    },
  }
</script>
