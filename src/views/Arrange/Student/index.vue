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
        <h2>学员排课</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/arrange/student/detail/2')">打印</Button>
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
        { title: '班级', key: 2, align: 'center' },
        { title: '学员姓名', key: 3, align: 'center' },
        { title: '学员编号', key: 4, align: 'center' },
        { title: '当前年级', key: 5, align: 'center' },
        { title: '班主任', key: 6, align: 'center' },
        { title: '学管师', key: 7, align: 'center' },
        { title: '产品名称', key: 8, align: 'center' },
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
          2: '222',
          3: '啊啊啊',
          4: '112312',
          5: '三年级',
          6: '小卢',
          7: '小张',
          8: '个性化一对一教学',
          9: '18',
        },
        {
          1: '1',
          2: '222',
          3: '啊啊啊',
          4: '112312',
          5: '三年级',
          6: '小卢',
          7: '小张',
          8: '个性化一对一教学',
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
