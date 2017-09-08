<template>
  <div>知识点部分</div>
</template>

<script>
/**
 * 题库中心 - 知识点
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'question-knowledge',

  data: () => ({
    name: 'knowledge',
  }),

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
