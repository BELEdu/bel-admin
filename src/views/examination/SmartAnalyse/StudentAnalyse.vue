<template>
  <div>分析详情</div>
</template>

<script>
/**
 * 测试管理 - 智能分析 - 分析详情
 * @author hjz
 * @version 2017-06-23
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
