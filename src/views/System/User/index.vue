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
        <h2>用户列表</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/system/user/edit')">添加用户</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="data" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>
  </div>
</template>

<script>
/**
 * 系统管理 - 用户管理
 * @author lmh
 * @version 2017-06-07
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-system-user',

  data() {
    return {
      form: {
        keyword: '',
      },

      columns: [
        { title: '员工编号', key: 1, align: 'center' },
        { title: '用户名', key: 2, align: 'center' },
        { title: '姓名', key: 3, align: 'center' },
        { title: '手机号', key: 4, align: 'center' },
        { title: '邮箱', key: 5, align: 'center' },
        { title: '性别', key: 6, align: 'center' },
        { title: '部门角色', key: 7, align: 'center', width: 300 },
        { title: '岗位性质', key: 8, align: 'center' },
        { title: '最近登录时间', key: 9, align: 'center', width: 125 },
        { title: '状态', key: 10, align: 'center' },
        {
          title: '操作',
          key: 11,
          align: 'center',
          render: createButton([
            { icon: 'trash-a', type: 'error' },
            { icon: 'edit', type: 'primary', click: () => this.$router.push('/system/user/edit/2') },
          ]),
        },
      ],

      data: [
        {
          1: 'sz101002',
          2: 'JSB00001',
          3: '侯晓辉辉',
          4: '13112345678',
          5: 'yang@qq.com',
          6: '男',
          7: '厦门分公司/教学部-教师',
          8: '全职',
          9: '2017-04-05 18:22',
          10: '启用',
        },
        {
          1: 'sz101002',
          2: 'JSB00001',
          3: '侯晓辉',
          4: '13112345678',
          5: 'yang@qq.com',
          6: '男',
          7: '厦门分公司/教学部-教师',
          8: '全职',
          9: '2017-04-05 18:22',
          10: '启用',
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
