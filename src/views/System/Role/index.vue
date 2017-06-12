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
        <h2>角色管理</h2>
      </Col>
      <Col>
        <Button type="primary">添加角色</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="data" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>
  </div>
</template>

<script>
/**
 * 系统管理 - 角色管理
 * @author lmh
 * @version 2017-06-06
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-system-role',

  data: () => ({
    form: {
      keyword: '',
    },

    columns: [
      { title: '序号', type: 'index', align: 'center', width: 50 },
      { title: '角色编号', key: 2, align: 'center' },
      { title: '角色名称', key: 3, align: 'center' },
      { title: '所属部门', key: 4, align: 'center' },
      { title: '角色类型', key: 5, align: 'center' },
      { title: '角色描述', key: 6, align: 'center', width: 300 },
      {
        title: '操作',
        key: 7,
        align: 'center',
        render: createButton([
          { icon: 'person', type: 'primary' },
          { icon: 'edit', type: 'primary' },
        ]),
      },
    ],

    data: [
      {
        2: 'JSBH1000001',
        3: '公司总经理',
        4: '总部',
        5: '系统定制',
        6: '角色相关描述',
      },
      {
        2: 'JSBH1000001',
        3: '公司总经理',
        4: '总部',
        5: '系统定制',
        6: '角色相关描述',
      },
      {
        2: 'JSBH1000001',
        3: '公司总经理',
        4: '总部',
        5: '系统定制',
        6: '角色相关描述',
      },
      {
        2: 'JSBH1000001',
        3: '公司总经理',
        4: '总部',
        5: '系统定制',
        6: '角色相关描述',
      },
    ],

    pager: undefined,
  }),

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style>

</style>
