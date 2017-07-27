<template>
  <div>试题解析</div>
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

