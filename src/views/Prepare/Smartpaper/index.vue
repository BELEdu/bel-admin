<template>
  <div class="smartpaper">
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
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2 icon="">学员列表</h2>
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
 * 备课管理 - 智能组卷
 * @author hjz
 * @version 2017-06-27
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {

  data: () => ({
    fcol: [
      { title: '学员姓名', key: 1, align: 'center' },
      { title: '地区', key: 2, align: 'center' },
      { title: '在读学校', key: 3, align: 'center' },
      { title: '当前年级', key: 4, align: 'center' },
      { title: '学科', key: 5, align: 'center' },
      { title: '知识点总数', key: 6, align: 'center' },
      { title: '试卷总数', key: 7, align: 'center' },
      {
        title: '操作',
        key: 8,
        align: 'center',
        width: 250,
        render: h => h(
          'div',
          [
            h(
              'Button',
              {
                props: { size: 'small', type: 'primary' },
                style: { margin: '3px' },
              },
              '查看试卷',
            ),
            h(
              'Button',
              {
                props: { size: 'small', type: 'success' },
                style: { margin: '3px' },
              },
              '智能组卷',
            ),
            h(
              'Button',
              {
                props: { size: 'small', type: 'info' },
                style: { margin: '3px' },
              },
              '人工组卷',
            ),
          ],
        ),
      },
    ],
    fdata: Array(10).fill(null).map(() => ({
      1: '李园园',
      2: '福建省厦门市',
      3: '蔡塘中学',
      4: '高中三年级',
      5: '【语文】【数学】【英语】',
      6: 100,
      7: 2,
    })),
  }),

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.smartpaper {

  & .ivu-form-item {
    display: inline-block;

    &:last-child {
      float: right;
      margin: 0;
    }
  }
}
</style>
