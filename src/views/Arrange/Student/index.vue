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
        <h2>学员列表</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/arrange/student/detail/2')">学员课表</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="data" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>
  </div>
</template>

<script>
/**
 * 排课管理 - 学员排课
 * @author yangjun
 * @version 2017-06-08
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-arrange-student',

  data() {
    return {
      form: {
        keyword: '',
      },

      columns: [
        { title: '序号', key: 1, align: 'center', width: 50 },
        { title: '学员姓名', key: 2, align: 'center' },
        { title: '学员编号', key: 3, align: 'center' },
        { title: '性别', key: 4, align: 'center', width: 100 },
        { title: '出生日期', key: 5, align: 'center' },
        { title: '在读学校', key: 6, align: 'center' },
        { title: '当前年级', key: 7, align: 'center' },
        { title: '教管师', key: 8, align: 'center' },
        { title: '剩余课时', key: 9, align: 'center' },
        {
          title: '操作',
          key: 10,
          align: 'center',
          render: createButton([
            { icon: 'trash-a', type: 'error' },
            { icon: 'edit', type: 'primary', click: () => this.$router.push('/arrange/student/detail/2') },
          ]),
        },
      ],

      data: [
        {
          1: '1',
          2: '侯晓辉',
          3: '13112345678',
          4: '男',
          5: '2003-1-5',
          6: '厦门双十中学',
          7: '初中三年级',
          8: '吴红',
          9: '18',
        },
        {
          1: '2',
          2: '侯晓辉',
          3: '13112345678',
          4: '男',
          5: '2003-1-5',
          6: '厦门双十中学',
          7: '初中三年级',
          8: '吴红',
          9: '18',
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
