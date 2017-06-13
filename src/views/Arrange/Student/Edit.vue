<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Row>
          <Col span="11">
            <Date-picker type="date" v-model="form.start" placeholder="选择日期"></Date-picker>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
            <Date-picker type="date" v-model="form.end" placeholder="选择日期"></Date-picker>
          </Col>
        </Row>
      </Form-item>

      <Form-item prop="start">
        <Input v-model="form.keyword" placeholder="请输入关键字"></Input>
      </Form-item>

      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>

    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>排课表</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/arrange/student/detail/2')">添加课表</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="data" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>
  </div>
</template>

<script>
/**
 * 排课管理 - 学员排课 - 学员排课表
 * @author yangjun
 * @version 2017-06-14
 */

import { GLOBAL } from '@/store/mutationTypes'
// import { createButton } from '@/utils'
import Operations from './components/Operations'

export default {
  name: 'app-arrange-student-edit',

  data() {
    return {
      form: {
        keyword: '',
      },

      columns: [
        { title: '序号', key: 1, align: 'center', width: 50 },
        { title: '学员姓名', key: 2, align: 'center' },
        { title: '学员编号', key: 3, align: 'center' },
        { title: '教师姓名', key: 4, align: 'center' },
        { title: '上课日期', key: 5, align: 'center', width: 150 },
        { title: '上课时段', key: 6, align: 'center' },
        { title: '排课课时', key: 7, align: 'center' },
        { title: '实际上课课时', key: 8, align: 'center' },
        { title: '上课科目', key: 9, align: 'center' },
        { title: '上课年级', key: 10, align: 'center' },
        { title: '课时类型', key: 11, align: 'center' },
        { title: '学管师', key: 12, align: 'center' },
        { title: '课时状态', key: 13, align: 'center', width: 80 },
        {
          title: '操作',
          key: 14,
          align: 'center',
          width: 300,
          render: (h, params) => h(Operations, {
            props: {
              item: params.row,
            },
          }),
        },
      ],

      data: [
        {
          1: '1',
          2: '侯晓辉',
          3: '111111',
          4: '111111',
          5: '2017/4/30(星期日)',
          6: '10:00-11:00',
          7: '60分钟',
          8: '2222',
          9: '数学',
          10: '初中三年级',
          11: '一对一',
          12: '大家伙',
          13: '待确认',
          id: 1,
          status: [0, 1, 2],
        },
        {
          1: '2',
          2: '侯晓辉',
          3: '111111',
          4: '111111',
          5: '2017/4/30(星期日)',
          6: '10:00-11:00',
          7: '60分钟',
          8: '7777',
          9: '数学',
          10: '初中三年级',
          11: '一对一',
          12: '大家伙',
          13: '待确认',
          id: 2,
          status: [3, 4, 1],
        },
      ],

      pager: undefined,
    }
  },

  components: {
    operations: Operations,
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style>

</style>
