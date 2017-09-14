<template>
  <div>
    <app-editor-title></app-editor-title>
  </div>
</template>

<script>
/**
 * 题库中心 - 编辑试题
 *
 * @author
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'question-question-edit',

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
