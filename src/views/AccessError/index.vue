<template>
  <div>您没有权限浏览该页</div>
</template>

<script>
/**
 * 权限错误提示页
 * @author lmh
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>
