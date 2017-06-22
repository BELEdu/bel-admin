<template>
  <div class="smartexam">
    <!-- 顶部 搜索栏 -->
    <Form class="app-search-form">
      <form-item>
        <Input placeholder="请输入关键字"></Input>
      </form-item>
      <form-item>
        <Button type="primary">查询搜索</Button>
      </form-item>
    </Form>
    <!-- 顶部 搜索栏 end -->
    <!-- 中部 列表title栏 -->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2 icon="">智能测试</h2>
      </Col>
    </Row>
    <!-- 中部 列表title栏 end -->
    <!-- 下部 列表展示-->
    <Table :data="buffer" :columns="colConfig"></Table>
    <!-- 下部 列表展示 end -->
    <!-- 底部 分页 -->
    <app-pager></app-pager>
    <!-- 底部 分页 end -->
    <!-- 测试弹窗组件 -->
    <local-exam-edit v-model="switcher"></local-exam-edit>
    <!-- 测试弹窗组件 end -->
  </div>
</template>

<script>
/**
 * 测试管理 - 智能测试
 * @author hjz
 * @version 2017-06-22
 */
import { GLOBAL } from '@/store/mutationTypes'
import { colConfig, buffer } from './modules/config'
import ExamEdit from './components/ExamEdit'

export default {

  data() {
    return {
      // 全员列表数据
      buffer,
      // 全员列表配置
      colConfig: colConfig(this),
      // 立即测试开关
      switcher: false,
    }
  },

  methods: {
    /**
     * @param { number } row 学员信息
     * @description 获取student_id，跳转学员详情页
     * @description 跳转页面应该是：/examination/smartexam/${id}
     */
    checkStu() {
      this.$router.push('/examination/smartexam/1')
    },
    /**
     * @param { number } row.student_id | $route.params.id 学员id
     * @description 获取student_id用于<添加试卷>的提交
     * @description 显示<添加试卷>组件
     */
    examineStu() {
      this.switcher = true
    },
  },

  components: {
    localExamEdit: ExamEdit,
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.smartexam {

  & .ivu-form-item {
    display: inline-block;

    &:last-child {
      float: right;
      margin: 0;
    }
  }
}
</style>
