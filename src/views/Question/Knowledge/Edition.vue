<template>
  <div>知识点批量编辑</div>
</template>

<script>
/**
 * 题库中心 - 知识点 - 批量编辑
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'question-knowledge-edition',

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
