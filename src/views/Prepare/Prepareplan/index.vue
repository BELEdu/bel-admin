<template>
  <div class="prepareplan">
    <!-- 上部 搜索栏 -->
    <Form class="app-search-form">
      <Form-item>
        <Date-picker format="yyyy/MM/dd" type="daterange" placeholder="请选择时间段..."></Date-picker>
      </Form-item>
      <Form-item>
        <Input placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary">查询搜索</Button>
      </Form-item>
    </Form>
    <!-- 上部 搜索栏 end -->
    <!-- 中部 列表title栏 -->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2 icon="">教案管理</h2>
      </Col>
      <Col>
      <Button type="primary" @click="createPlan()">添加教案</Button>
      </Col>
    </Row>
    <!-- 中部 列表title栏 end -->
    <!-- 下部 列表展示-->
    <Table :data="fdata" :columns="fcol"></Table>
    <!-- 下部 列表展示 end -->
    <!-- 底部 分页 -->
    <app-pager></app-pager>
    <!-- 底部 分页 end -->
  </div>
</template>

<script>
/**
 * 备课管理 - 教案管理
 * @author hjz
 * @version 2017-06-26
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {

  data() {
    return {
      fcol: [
        { title: '教师姓名', key: 1, align: 'center' },
        { title: '上课科目', key: 2, align: 'center' },
        { title: '教学对象', key: 3, align: 'center' },
        { title: '上课时间', key: 4, align: 'center' },
        { title: '课时', key: 5, align: 'center' },
        { title: '课题', key: 6, align: 'center' },
        { title: '知识点情况', key: 7, align: 'center' },
        {
          title: '操作',
          key: 8,
          align: 'center',
          width: 230,
          render: h => h(
            'div',
            [
              h(
                'Button',
                {
                  props: { size: 'small', type: 'text' },
                  class: 'color-info',
                  on: { click: this.checkPlan },
                },
                '查看',
              ),
            ],
          ),
        },
      ],
      fdata: Array(10).fill(null).map(() => ({
        1: '张旭',
        2: '数学',
        3: '高三',
        4: '2017-06-06 至2017-08-08',
        5: 5,
        6: '数与式的课程管理',
        7: 100,
      })),
    }
  },

  methods: {
    // checkPlan() {
    //   this.$router.push('/prepare/prepareplan/edit')
    // },
    createPlan() {
      this.$router.push('/prepare/prepareplan/create')
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.prepareplan {

  & .ivu-form-item {
    display: inline-block;

    &:last-child {
      float: right;
      margin: 0;
    }
  }
}
</style>
