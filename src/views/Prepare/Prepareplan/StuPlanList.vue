<template>
  <div class="stuplanlist">
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
      <h2 icon="">学员教案</h2>
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
 * 备课管理 - 教案管理 - 学员教案列表
 * @author hjz
 * @version 2017-06-29
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {

  data() {
    return {
      fcol: [
        { title: '课题', key: 1, align: 'center' },
        { title: '上课时间', key: 2, align: 'center' },
        { title: '课时长', key: 3, align: 'center' },
        { title: '知识点情况', key: 4, align: 'center' },
        {
          title: '操作',
          key: 5,
          align: 'center',
          render: h => h(
            'div',
            [
              h(
                'Button',
                {
                  props: { size: 'small', type: 'text' },
                  class: 'color-info',
                  on: { click: this.checkInfo },
                },
                '查看',
              ),
            ],
          ),
        },
      ],
      fdata: Array(10).fill(null).map(() => ({
        1: '数与式的课程管理',
        2: '2017-06-06至2017-08-08',
        3: 5,
        4: 100,
      })),
    }
  },

  methods: {
    checkInfo() {
      this.$router.push('/prepare/prepareplan/create')
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.stuplanlist {

  & .ivu-form-item {
    display: inline-block;

    &:last-child {
      float: right;
      margin: 0;
    }
  }
}
</style>
