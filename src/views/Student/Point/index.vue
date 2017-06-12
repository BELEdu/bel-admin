<template>
  <div>
    学员知识点
  </div>
</template>

<script>
 /**
  * 学员管理 - 学员知识点
  * @author zml
  * @version 2017-06-08
  */
import { GLOBAL } from '@/store/mutationTypes'

export default {
   name: 'app-student-point',

   created() {
     this.$store.commit(GLOBAL.LOADING.HIDE)
   },
}
</script>

<style lang="less">
@import '~vars';
</style>
