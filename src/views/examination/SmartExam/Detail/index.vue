<template>
<div>
  <!-- 测试主组件 -->
  <router-view
    :testid="testid"
    :students="students"
  ></router-view>
</div>
</template>

<script>
/**
 * 测试管理 - 智能测试 - 测试详情主组件
 * @author zhoumenglin
 * @version 2017-10-23
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {

  data() {
    return {
      students: [],
    }
  },

  computed: {
    // 测试id
    testid() {
      return +this.$route.params.testid
    },
  },

  methods: {
    // 获取参加该测试的学生信息
    getStudents() {
      return this.$http.get(`/test/paper/${this.testid}`)
        .then((res) => {
          this.students = res
        })
    },
  },

  created() {
    this.getStudents()
      .then(() => {
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },

}
</script>

<style lang="less">

</style>
