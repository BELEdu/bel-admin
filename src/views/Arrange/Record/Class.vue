<template>
  <div>
    <search-record></search-record>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>上课记录</h2>
      </Col>
      <!--<Col>
        <Button type="primary" @click="$router.push('/arrange/teacher/detail/2')">教师课表</Button>
      </Col>-->
    </Row>

    <Table class="app-table" :columns="columns" :data="data" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>
  </div>
</template>

<script>
/**
 * 排课管理 - 上课记录班级
 * @author yangjun
 * @version 2017-06-14
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import SearchRecord from '../Components/Search'

export default {
  name: 'app-arrange-record-class',

  data() {
    return {
      form: {
        keyword: '',
      },

      columns: [
        { title: '序号', key: 1, align: 'center', width: 50 },
        { title: '班级名称', key: 2, align: 'center' },
        { title: '学员姓名', key: 3, align: 'center' },
        { title: '学员编号', key: 4, align: 'center' },
        { title: '教师姓名', key: 5, align: 'center' },
        { title: '上课日期', key: 6, align: 'center' },
        { title: '上课时段', key: 7, align: 'center' },
        { title: '实际上课课时', key: 8, align: 'center' },
        { title: '上课科目', key: 9, align: 'center' },
        { title: '上课年级', key: 10, align: 'center' },
        { title: '产品名称', key: 11, align: 'center' },
        { title: '学管师', key: 12, align: 'center' },
        { title: '课时状态', key: 13, align: 'center' },
        {
          title: '操作',
          key: 14,
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
          2: '奥数小班',
          3: '丽丽',
          4: '11111',
          5: '兼职',
          6: '2017/4/30',
          7: '10:00-11:00',
          8: '60分钟',
          9: '数学',
          10: '初中三年级',
          11: '60分钟',
          12: '奥数小班',
          13: '哈哈',
        },
        {
          1: '2',
          2: '奥数小班',
          3: '丽丽',
          4: '11111',
          5: '兼职',
          6: '2017/4/30',
          7: '10:00-11:00',
          8: '60分钟',
          9: '数学',
          10: '初中三年级',
          11: '60分钟',
          12: '奥数小班',
          13: '哈哈',
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
