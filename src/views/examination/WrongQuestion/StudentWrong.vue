<template>
  <div>错题库</div>
</template>

<script>
/**
 * 测试管理 - 错题管理 - 错题库
 * @author hjz
 * @version 2017-06-25
 * @description
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
