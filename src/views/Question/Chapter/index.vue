<template>
  <div class="question-chapter">章节部分</div>
</template>

<script>
/**
 * 题库中心 - 章节
 *
 * @author
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'question-chapter',

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
