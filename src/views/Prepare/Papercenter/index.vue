<template>
  <div class="paperinfo">
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
      <h2 icon="">试卷列表</h2>
      <span v-if="$route.params.id">学员：李园园</span>
      </Col>
      <Col>
        <Button type="primary">人工组卷</Button>
        <Button type="primary">智能组卷</Button>
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
 * 备课管理 - 智能组卷 - 学员试卷列表
 * @author hjz
 * @version 2017-06-27
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {

  data() {
    return {
      fcol: [
        { title: '试卷标题', key: 1, width: 400, align: 'center' },
        { title: '学科', key: 2, align: 'center' },
        { title: '试题量', key: 3, align: 'center' },
        { title: '创建人', key: 4, align: 'center' },
        { title: '创建时间', key: 5, align: 'center' },
        { title: '浏览量', key: 6, align: 'center' },
        {
          title: '操作',
          key: 6,
          align: 'center',
          render: h => h(
            'div',
            [
              h(
                'Button',
                {
                  props: { size: 'small', type: 'text' },
                  class: 'color-error',
                  style: { margin: '3px' },
                },
                '删除',
              ),
              h(
                'Button',
                {
                  props: { size: 'small', type: 'text' },
                  class: 'color-primary',
                  style: { margin: '3px' },
                },
                '查看',
              ),
            ],
          ),
        },
      ],
      fdata: Array(10).fill(null).map(() => ({
        1: '2017届广东省汕头市潮师高级中学高三上学期期中考试语文试卷',
        2: '高中数学',
        3: 15,
        4: '李小平',
        5: '2017-04-23',
        6: 77,
      })),
    }
  },

  methods: {
    checkInfo() {
      this.$router.push('/prepare/smartpaper/1')
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.paperinfo {

  & h2 {
    display: inline-block;
    margin-right: 30px;
  }

  & .ivu-form-item {
    display: inline-block;

    &:last-child {
      float: right;
      margin: 0;
    }
  }
}
</style>
