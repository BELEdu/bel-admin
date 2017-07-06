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

    <Table class="app-table" :columns="columns" :data="list.data" border></Table>

    <app-pager :data="list" @on-change="goTo"></app-pager>
  </div>
</template>

<script>
/**
 * 流程管理
 * @author lmh
 * @version 2017-07-05
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { GLOBAL, SYSTEM } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-system-process',

  mixins: [list],

  data() {
    return {
      query: {},

      form: {
        start: '',
        end: '',
        keyword: '',
      },

      columns: [
      { title: '序号', align: 'center', type: 'index' },
      { title: '流程编号', key: 'flow_number', align: 'center' },
      { title: '流程名称', key: 'display_name', align: 'center' },
      { title: '所属部门', key: 'department_name', align: 'center' },
      { title: '流程类型', key: 'flow_type_name', align: 'center' },
      { title: '申请角色', key: 'apply_role_name', align: 'center' },
      { title: '创建类型', key: 'flow_create_type_name', align: 'center' },
        {
          title: '操作',
          align: 'center',
          render: createButton([
          { text: '删除', type: 'error', click: row => this.$store.dispatch(SYSTEM.PROCESS.DELETE, row.id) },
          { text: '编辑', type: 'primary', click: row => this.$router.push(`/system/process/edit/${row.id}`) },
          ]),
        },
      ],
    }
  },

  computed: {
    ...mapState({
      list: state => state.system.process.list,
    }),
  },

  methods: {
    getData(qs) {
      this.$router.push(`/system/process${qs}`)

      this.$store.dispatch(SYSTEM.PROCESS.INIT, qs)
        .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
    },
  },
}
</script>
