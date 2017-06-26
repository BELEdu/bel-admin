<template>
  <div>Smartquestion</div>
</template>

<script>
/**
 * 备课管理 - 个性题库
 * @author hjz
 * @version 2017-06-26
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
