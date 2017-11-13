<template>
  <div class="report-profiles">

  </div>
</template>

<script>
  /**
   * 试卷中心-报告配置
   * @author chenliangshan
   * @version 2017-11-13
   */

  import { list } from '@/mixins'

  export default {
    name: 'report-profiles',

    mixins: [list],

    data() {
      return {}
    },

    methods: {
      getData() {
        return this.$http.get('')
          .then(() => {

          })
      },
    },
  }
</script>

<style lang="less" scoped>
  .report-profiles {

  }
</style>
