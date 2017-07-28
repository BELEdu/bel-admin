<template>
  <waterfall
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
          <data-module v-if="visibleModule" :type="item.name" :data="item"></data-module>
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
  import { debounce } from 'lodash'
  import DataModule from './DataModule'

  export default {
    name: 'home-module',
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
        blockHeight: [400, 250, 400, 360, 560, 420, 500, 350, 400, 600, 460, 450, 480],
        moduleWidth: 100,
        visibleModule: false,
        delayTime: 10,
        waterfallDom: null,
      }
    },
    created() {
      window.addEventListener('resize', debounce(this.setWH, this.delayTime))
    },
    mounted() {
      this.waterfallDom = this.$refs.waterfall.$el
      this.setWH()
    },
    beforeDestroy() {
      window.removeEventListener('resize', debounce(this.setWH, this.delayTime))
    },
    methods: {
      setWH() {
        this.moduleWidth = this.waterfallDom.clientWidth / 2
      },
      reflowed() {
        if (!this.visibleModule) {
          this.setWH()
          this.visibleModule = true
        }
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
        >div {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
