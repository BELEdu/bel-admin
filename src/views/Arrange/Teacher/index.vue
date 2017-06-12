<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item prop="start">
        <Input v-model="form.keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>教师列表</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/arrange/teacher/detail/2')">教师课表</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="data" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>
  </div>
</template>

<script>
/**
 * 排课管理 - 教师排课
 * @author yangjun
 * @version 2017-06-08
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-arrange-teacher',

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
        { title: '性别', key: 6, align: 'center', width: 100 },
        { title: '授课年级', key: 7, align: 'center' },
        { title: '授课科目', key: 8, align: 'center' },
        {
          title: '操作',
          key: 9,
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
          6: '男',
          7: '初中三年级',
          8: '数学',
        },
        {
          1: '2',
          2: '阿辉',
          3: '13112345678',
          4: '厦门分公司前埔校区教学管理部学科组',
          5: '兼职',
          6: '男',
          7: '初中三年级',
          8: '语文',
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
