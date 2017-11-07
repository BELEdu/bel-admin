<template>
  <div class="student-review">
    <!-- 标签 -->
    <Tabs
      class="app-tabs"
      type="card"
      :value="tabActive"
      :animated="false"
      @on-click="tabSelect"
    >
      <Tab-pane label="基本信息" name="info"></Tab-pane>
      <Tab-pane label="签约产品" name="product"></Tab-pane>

      <div slot="extra">
        <Tag type="dot" color="blue"><b>学员姓名</b>：{{display_name}} </Tag>
        <Tag type="dot" color="yellow"><b>学员编号</b>： {{number}} </Tag>
        <Tag type="dot" color="green"><b>当前状态</b>： {{student_current_status_name}} </Tag>
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
  name: 'app-student-student-review',

  data() {
    return {

      tabActive: '', // 当前激活的tab
      display_name: '', // 学员姓名
      number: '', // 学员编号
      student_current_status_name: '', // 当前状态
    }
  },

  computed: {
    id() {
      return +this.$router.currentRoute.params.id
    },
  },

  methods: {

    tabSelect(name) { // 标签栏路由切换
      this.$router.push(`/student/student/${this.id}/${name}`)
    },

    getStudentData() { // 获取学员信息
      return this.$http.get(`/student/${this.id}`)
        .then((res) => {
          this.display_name = res.display_name
          this.number = res.number
          this.student_current_status_name = res.student_current_status_name
        })
    },
  },

  created() {
    this.getStudentData()
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))

    // 获取URL最后一个 / 后面的单词，用于判断 tab active
    const pathArry = this.$route.path.split('/')
    this.tabActive = pathArry[pathArry.length - 1]
  },

}
</script>

<style lang="less">
@import '~vars';
</style>
