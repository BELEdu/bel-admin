<template>
  <div>
    添加教案</div>
</template>

<script>
/**
 * 备课管理 - 教案管理 - 添加教案/查看教案
 * @author hjz
 * @version 2017-06-28
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
