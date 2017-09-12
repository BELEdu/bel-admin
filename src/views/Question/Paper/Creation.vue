<template>
  <div class="question-paper-creation">生成试卷</div>
</template>

<script>
/**
 * 题库中心 - 试卷 - 生成试卷
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'question-paper-creation',

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
