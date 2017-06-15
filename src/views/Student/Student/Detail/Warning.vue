<template>
  <div>
    学员详情-预警信息
  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息 - 学员详情 - 预警信息
 * @author zml
 * @version 2017-06-14
 */
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-student-student-detail-warning',

  data() {
    return {

    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

}
</script>

<style <style lang="less">

</style>
