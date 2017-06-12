<template>
  <div>
    学员管理
  </div>
</template>

<script>
 /**
  * 学员管理 -
  * @author zml
  * @version 2017-06-08
  */
import { GLOBAL } from '@/store/mutationTypes'

export default {
   name: 'app-student',

   created() {
     this.$store.commit(GLOBAL.LOADING.HIDE)
   },
}
</script>

<style lang="less" scoped>

</style>
