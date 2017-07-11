<template>
  <div>退费</div>
</template>

<script>
/**
 * 合同审批 - 退费流程
 * @author hjz
 * @version 2017-07-11
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

