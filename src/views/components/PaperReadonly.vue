<template>
  <div class="paper-readonly">

    <!-- 试卷头部 -->
    <paper-readonly-header
      :data="data"
    ></paper-readonly-header>

    <!-- 试卷主体 -->
    <paper-readonly-body
      :data="data"
      :width="width"
    ></paper-readonly-body>

  </div>
</template>

<script>
/**
 * 查看试卷 - 整卷模板
 *
 * @author zhoumenglin
 */

import PaperReadonlyHeader from './PaperReadonlyHeader'
import PaperReadonlyBody from './PaperReadonlyBody'

export default {
  components: {
    PaperReadonlyHeader,
    PaperReadonlyBody,
  },

  props: {
    // 试卷数据
    data: {
      type: Object,
      required: true,
    },
    // 试题宽度，默认以A4纸比例
    width: {
      type: [String, Number],
      default: 790,
    },
  },
}
</script>

<style lang="less">
@import "~vars";
// .paper-readonly {

// }
</style>
