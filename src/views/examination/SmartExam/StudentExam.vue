<template>
  <div>学员考试</div>
</template>

<script>
import { GLOBAL } from '@/store/mutationTypes'

export default {
  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
