<template>
  <div>
    WrongQuestion</div>
</template>

<script>
/**
 * 测试管理 - 错题管理
 * @author hjz
 * @version 2017-06-22
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
