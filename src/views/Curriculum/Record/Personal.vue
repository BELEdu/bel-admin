<template>
  <div>
    <search-record></search-record>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>上课记录</h2>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="data" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>
  </div>
</template>

<script>
/**
 * 排课管理 - 上课记录非班级
 * @author yangjun
 * @version 2017-06-14
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import SearchRecord from '../Components/Search'

export default {
  name: 'app-arrange-record-personal',

  data() {
    return {
      form: {
        keyword: '',
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

  components: {
    searchRecord: SearchRecord,
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style>

</style>
