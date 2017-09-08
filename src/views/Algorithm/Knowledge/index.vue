<template>
  <div>学员知识点</div>
</template>

<script>
/**
 * 算法中心 - 学员知识点
 *
 * @author
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'algorithm-knowledge',

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
