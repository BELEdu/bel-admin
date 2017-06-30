<template>
  <div>试卷预览</div>
</template>

<script>
/**
 * 题库列表 - 试卷预览
 * @author hjz
 * @version 2017-06-30
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style>

</style>
