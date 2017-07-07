<template>
  <div class="wrongquestion">
    <!-- 上部 搜索栏 -->
    <Form class="app-search-form">
      <form-item>
        <Input placeholder="请输入关键字"></Input>
      </form-item>
      <form-item>
        <Button type="primary">查询搜索</Button>
      </form-item>
    </Form>
    <!-- 上部 搜索栏 end -->
    <!-- 中部 列表title栏 -->
    <Row class="app-content-header">
      <h2>
        <svg class="svg-icon" viewBox="0 0 1024 1024" width="14px" height="14px">
          <path d="M0 0l455.111111 0 0 455.111111-455.111111 0 0-455.111111Z"></path>
          <path d="M568.888889 0l455.111111 0 0 455.111111-455.111111 0 0-455.111111Z"></path>
          <path d="M0 568.888889l455.111111 0 0 455.111111-455.111111 0 0-455.111111Z"></path>
          <path d="M568.888889 568.888889l455.111111 0 0 455.111111-455.111111 0 0-455.111111Z"></path>
        </svg>
        错题管理
      </h2>
    </Row>
    <!-- 中部 列表title栏 end -->
    <!-- 下部 列表展示-->
    <Table :data="buffer" :columns="colConfig"></Table>
    <!-- 下部 列表展示 end -->
    <!-- 底部 分页 -->
    <app-pager></app-pager>
    <!-- 底部 分页 end -->
  </div>
</template>

<script>
/**
 * 测试管理 - 错题管理
 * @author hjz
 * @version 2017-06-22
 * @description
 */
import { GLOBAL } from '@/store/mutationTypes'
import { colConfig, buffer } from './modules/config'

export default {
  data() {
    return {
      // 全员列表数据
      buffer,
      // 全员列表配置
      colConfig: colConfig(this),
    }
  },

  methods: {
    checkStu() {
      this.$router.push('/examination/wrongquestion/1')
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.wrongquestion {

  & .ivu-form-item {
    display: inline-block;

    &:last-child {
      float: right;
      margin: 0;
    }
  }
}
</style>
