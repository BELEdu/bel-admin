<template>
  <div>

    <Tabs :value="tabActive" type="card" :animated="false" @on-click="tabSelect" class="app-tabs">
      <Tab-pane label="基础信息" name="edit"></Tab-pane>
      <Tab-pane label="交流会" name="meeting"></Tab-pane>
      <Tab-pane label="预警信息" name="warning"></Tab-pane>
      <div slot="extra">
        <Tag type="dot" color="blue"><b>学员姓名</b>：{{display_name}} </Tag>
        <Tag type="dot" color="yellow"><b>学员编号</b>： {{number}} </Tag>
      </div>
    </Tabs>

    <router-view></router-view>

  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息 - 学员详情 - 主组件
 * @author zml
 * @version 2017-06-27
 */
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-student-student-detail',

  data() {
    return {

      tabActive: '', // 当前激活的tab
      display_name: '', // 学员姓名
      number: '', // 学员编号
    }
  },

  computed: {
    studentId() {
      return +this.$router.currentRoute.params.studentId
    },
  },

  methods: {

    tabSelect(name) { // 标签栏路由切换
      this.$router.push(`/student/student/${this.studentId}/${name}`)
    },

    getStudentData() { // 获取学员信息
      return this.$http.get(`/student/${this.studentId}`)
        .then((res) => {
          this.display_name = res.display_name
          this.number = res.number
        })
    },
  },

  created() {
    this.getStudentData().then(() => this.$store.commit(GLOBAL.LOADING.HIDE))

    // 获取URL最后一个 / 后面的单词，用于判断 tab active
    const pathArry = this.$route.path.split('/')
    this.tabActive = pathArry[pathArry.length - 1]

    // 如果从学员列表进入的时候，特殊处理
    if (pathArry[pathArry.length - 2] === 'meeting') {
      this.tabActive = 'meeting'
    }
    // 如果是手动输入url到编辑交流会的时候，特殊处理
    if (pathArry[pathArry.length - 3] === 'meeting') {
      this.tabActive = 'meeting'
    }
  },

}
</script>

<style lang="less">
@import '~vars';
</style>
