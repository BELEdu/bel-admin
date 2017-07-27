<template>
  <div class="sub-module" ref="module"></div>
</template>

<script>
  /**
   * 首页图表模块
   * @author  chenliangshan
   * @version 2017/07/27
   */

  import echartsInit from '../../mixins/echartsInit'
  import waterfallResize from '../../mixins/waterfallResize'

  export default {
    name: 'echart-module',
    mixins: [echartsInit, waterfallResize],
    props: {
      data: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        echartOption: this.data,
      }
    },
  }
</script>
