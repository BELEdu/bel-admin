<template>
  <div>试题部分</div>
</template>

<script>
/**
 * 题库中心 - 试题
 *
 * @author
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'question-question',

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
