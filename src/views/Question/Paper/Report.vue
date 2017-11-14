<template>
  <div>报告配置</div>
</template>

<script>
/**
 * 题库中心 - 试卷 - 报告配置
 *
 * @author zhoumenglin
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'QuestionPaperReport',

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
