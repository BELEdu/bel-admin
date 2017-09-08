<template>
  <div>试卷部分</div>
</template>

<script>
/**
 * 题库中心 - 试卷
 *
 * @author
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'question-paper',

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
