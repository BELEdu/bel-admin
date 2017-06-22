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
    <!-- 底部 分页 -->
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

export default {

  data() {
    return {
      buffer,
      colConfig: colConfig(this),
    }
  },

  methods: {
    /**
     * @param { object } row 学员信息
     * @description 获取student_id，跳转学员详情页
     * @description 跳转页面应该是：/examination/smartexam/${id}
     */
    checkStu() {
      //
    },
    /**
     * @param { object } row 学员信息
     * @description 获取student_id用于<添加试卷>的提交
     * @description 显示<添加试卷>组件
     */
    examineStu() {
      //
    },
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
