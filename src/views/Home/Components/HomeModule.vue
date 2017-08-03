<template>
  <waterfall
      :auto-resize="false"
      :line-gap="moduleWidth"
      :watch="data"
      @reflowed="reflowed"
      ref="waterfall"
      :class="className"
    >
      <waterfall-slot
        v-for="(item, index) in data"
        :width="moduleWidth"
        :height="blockHeight[index]"
        :order="index"
        :key="index"
        :class="className+'-solt'"
      >
        <div class="waterfall-module waterfall-block" :index="index" :style="{height: blockHeight[index]+'px'}">
          <Card style="height: 100%">
            <p slot="title">
              {{item.title}}
            </p>
            <data-module v-if="visibleModule" :width="moduleWidth" :type="item.name" :data="item"></data-module>
          </Card>
        </div>
      </waterfall-slot>
    </waterfall>
</template>
<script>
  /**
   * 首页模块
   * @author  chenliangshan
   * @version 2017/07/25
   */

  import { Waterfall, WaterfallSlot } from 'vue-waterfall'
  import { debounce, isNumber } from 'lodash'
  import { broadcast } from '@/mixins'
  import { GLOBAL } from '@/store/mutationTypes'
  import DataModule from './DataModule'

  export default {
    name: 'home-module',
    mixins: [broadcast],
    components: { Waterfall, WaterfallSlot, DataModule },
    props: {
      data: {
        type: Array,
        default: [],
      },
      className: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        blockHeight: [400, 220, 380, 360, 560, 420, 340, 460, 400, 600, 460, 450, 600],
        moduleWidth: 100,
        visibleModule: false,
        delayTime: 200,
        waterfallDom: null,
        resize: debounce(this.setWidth, this.delayTime,
          { leading: true, trailing: false }),
      }
    },
    created() {
      window.addEventListener('resize', this.resize, true)
    },
    mounted() {
      this.waterfallDom = this.$refs.waterfall.$el
      this.setWidth()
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize, true)
    },
    methods: {
      setWidth(w) {
        // width防止初始化前布局问题
        const width = isNumber(w) ? w : 0
        this.$nextTick(() => {
          const Dom = this.waterfallDom
          this.moduleWidth = (Dom.offsetWidth - width) / 2
        })
      },
      reflowed() {
        this.$nextTick(() => {
          if (!this.visibleModule) {
            this.setWidth()
            this.visibleModule = true
            this.$store.commit(GLOBAL.LOADING.HIDE)
          }
          // 重新计算Table组件宽度
          this.broadcast('Table', 'on-visible-change', true)
          // 重绘AppEcharts图表
          this.broadcast('app-echarts', 'on-resize-change', true)
        })
      },
    },
  }
</script>
<style lang="less">
  .waterfall-block {
    padding: 2px;
    .ivu-card {
      background-color: #fff;
      position: relative;
      padding-top: 51px;
      .ivu-card-head {
        width: 100%;
        position: absolute;
        top: 0;
      }
      .ivu-card-body {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
