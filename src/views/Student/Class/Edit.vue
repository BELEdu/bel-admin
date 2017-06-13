<template>
<div class="app-form-entire">
    <app-editor-title></app-editor-title>
    编辑班级
</div>
</template>

<script>
/**
 * 班级管理 - 班级信息 - 添加班级
 * @author zml
 * @version 2017-06-13
 */
import { GLOBAL } from '@/store/mutationTypes'
// import { createButton } from '@/utils'

export default {
  name: 'app-student-class-detail',

  data() {
    return {

    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
