<template>
  <div>
    签约产品列表
  </div>
</template>

<script>
import { GLOBAL } from '@/store/mutationTypes'

export default {

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

}
</script>

<style>

</style>
