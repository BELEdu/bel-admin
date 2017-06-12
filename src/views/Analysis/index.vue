<template>
  <div>
    统计管理
  </div>
</template>

<script>
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-analysis',

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style>

</style>
