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
        <Card shadow style="height: 100%">
          <p slot="title">
            {{item.title}}
          </p>
          <data-module :type="item.name" :data="item"></data-module>
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
        blockHeight: [400, 250, 400, 360, 560],
        moduleWidth: 100,
        moduleHeight: 100,
      }
    },
    methods: {
      reflowed() {
        this.$nextTick(() => {
          const width = this.$refs.waterfall.$el.clientWidth
          this.moduleWidth = width / 2
          this.moduleHeight = 100
        })
      },
    },
  }
</script>
<style lang="less">
  .waterfall-block {
    padding: 2px;
    .ivu-card {
      background-color: #eee;
    }
  }
</style>
