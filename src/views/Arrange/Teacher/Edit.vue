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
        <h2>教师课表情况</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/arrange/teacher/detail/2')">打印</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="data" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>
  </div>
</template>

<script>
/**
 * 排课管理 - 教师排课 - 教师排课表
 * @author yangjun
 * @version 2017-06-14
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-arrange-teacher-edit',

  data() {
    return {
      form: {
        keyword: '',
      },

      columns: [
        { title: '序号', key: 1, align: 'center', width: 50 },
        { title: '教师姓名', key: 2, align: 'center' },
        { title: '教学对象', key: 3, align: 'center' },
        { title: '上课日期', key: 4, align: 'center' },
        { title: '上课时段', key: 5, align: 'center' },
        { title: '排课课时', key: 6, align: 'center', width: 100 },
        { title: '实际上课课时', key: 7, align: 'center' },
        { title: '上课科目', key: 8, align: 'center' },
        { title: '上课年级', key: 9, align: 'center' },
        { title: '课时类型', key: 10, align: 'center' },
        { title: '学管师', key: 11, align: 'center' },
        { title: '课时状态', key: 12, align: 'center' },
        {
          title: '操作',
          key: 13,
          align: 'center',
          render: createButton([
            { icon: 'trash-a', type: 'error' },
            { icon: 'edit', type: 'primary', click: () => this.$router.push('/arrange/teacher/detail/2') },
          ]),
        },
      ],

      data: [
        {
          1: '1',
          2: '侯晓辉',
          3: '丽丽',
          4: '2017/4/30(星期日)',
          5: '10:00-11:00',
          6: '60分钟',
          7: '',
          8: '数学',
          9: '初中三年级',
          10: '一对一',
          11: '大家伙',
          12: '待确认',
        },
        {
          1: '2',
          2: '侯晓辉',
          3: '丽丽',
          4: '2017/4/30(星期日)',
          5: '10:00-11:00',
          6: '60分钟',
          7: '',
          8: '数学',
          9: '初中三年级',
          10: '一对一',
          11: '大家伙',
          12: '待确认',
        },
      ],

      pager: undefined,
    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style>

</style>
