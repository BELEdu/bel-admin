<template>
  <div class="home">
    home
  </div>
</template>

<script>
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-home',

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
</style>
