<template>
  <div class="examcollation">examcollation</div>
</template>

<script>
/**
 * 测试管理 - 批阅试卷
 * @author hjz
 * @version 2017-07-05
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
