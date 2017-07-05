<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Input type="text" v-model="form.keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">查询</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>审批流程列表</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/system/process/edit')">新建流程</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="data" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>
  </div>
</template>

<script>
/**
 * 流程管理
 * @author lmh
 * @version 2017-07-05
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-system-process',

  data: () => ({
    form: {
      start: '',
      end: '',
      keyword: '',
    },

    columns: [
      { title: '序号', key: 1, align: 'center', type: 'index' },
      { title: '流程编号', key: 2, align: 'center' },
      { title: '流程名称', key: 3, align: 'center' },
      { title: '所属部门', key: 4, align: 'center' },
      { title: '流程类型', key: 5, align: 'center' },
      { title: '申请角色', key: 6, align: 'center' },
      { title: '创建类型', key: 7, align: 'center' },
      {
        title: '操作',
        align: 'center',
        render: createButton([
          { text: '删除', type: 'error' },
          { text: '编辑', type: 'primary' },
        ]),
      },
    ],

    data: [
      {
        2: 'JSBH1000',
        3: '新签流程审批',
        4: '思明校区',
        5: '新签合同审批流程',
        6: '思明校区/咨询部-咨询师',
        7: '系统创建',
      },
    ],

    pager: undefined,
  }),

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>
