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
    props: {
      autoResize: {
        type: Boolean,
        default: true,
      },
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
        required: true,
      },
      delayTime: {
        type: Number,
        default: 300,
      },
    },
    data() {
      return {
        // 保存地图初始化的实例
        chart: '',
        resize: debounce(this.chartResize, this.delayTime, { leading: false, trailing: true }),
      }
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
    watch: {
      autoResize(val) {
        this.autoResizeHandler(val)
      },
    },
    methods: {
      // 初始化图表
      init() {
        this.chart = echarts.init(document.getElementById(this.id))
        this.chart.setOption(this.setOptions)
        this.autoResizeHandler(this.autoResize)
      },
      // 重绘图表
      chartResize() {
        this.chart.resize()
      },
      autoResizeHandler(autoResize) {
        if (autoResize === false || !this.autoResize) {
          window.removeEventListener('resize', this.resize, false)
        } else {
          window.addEventListener('resize', this.resize, false)
        }
      },
    },
    mounted() {
      // 初始化图表
      this.init()
      this.$on('on-resize-change', (val) => {
        if (val) {
          this.chartResize()
        }
      })
    },
    beforeDestroy() {
      this.autoResizeHandler(false)
      if (this.char) {
        // 销毁图表实例
        this.chart.dispose()
      }
    },
  }
</script>
