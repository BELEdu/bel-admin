<template>
  <div>
    排课管理
  </div>
</template>

<script>
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-arrange',

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style>

</style>
