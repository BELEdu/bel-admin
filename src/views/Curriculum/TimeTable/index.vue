<template>
  <div>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>排课表</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/arrange/timetable')">打印</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="data" border></Table>

  </div>
</template>

<script>
/**
 * 排课管理 - 周课表
 * @author yangjun
 * @version 2017-06-14
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-arrange-timetable',

  data() {
    return {
      form: {
        keyword: '',
      },

      course: {
        time: ['09:00 - 10:20', '10:40 - 12:00', '12:30 - 13:50'],
        data: [],
        color: {
          finish: '#58a0c8',
          right: '#d1a963',
          wait: '#c97f86',
          cancel: '#c22d15',
        },
      },

      columns: [
        { title: '序号', key: 1, align: 'center', width: 50 },
        { title: '教师姓名', key: 2, align: 'center' },
        { title: '员工编号', key: 3, align: 'center' },
        { title: '学科组', key: 4, align: 'center' },
        { title: '岗位性质', key: 5, align: 'center' },
        { title: '授课年级', key: 6, align: 'center' },
        { title: '授课科目', key: 7, align: 'center' },
        { title: '学生数', key: 8, align: 'center' },
        { title: '未上课时', key: 9, align: 'center' },
        { title: '已完成课时', key: 10, align: 'center' },
        {
          title: '操作',
          key: 11,
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
          3: '13112345678',
          4: '厦门分公司前埔校区教学管理部学科组',
          5: '兼职',
          6: '初中三年级',
          7: '8',
          8: '12',
          9: '12',
          10: '12',
        },
        {
          1: '2',
          2: '侯晓辉',
          3: '13112345678',
          4: '厦门分公司前埔校区教学管理部学科组',
          5: '兼职',
          6: '初中三年级',
          7: '8',
          8: '12',
          9: '12',
          10: '12',
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
