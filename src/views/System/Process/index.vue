<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键字">
          <Select v-model="likeKey" slot="prepend" style="width: 6em">
            <Option v-for="likeKey in likeKeys" :key="likeKey.value" :value="likeKey.value">{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">查询</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2><Icon type="aperture"></Icon> 审批流程</h2>
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
import { SYSTEM } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-system-process',

  mixins: [list],

  data() {
    return {
      likeKeys: [
        { label: '流程编号', value: 'flow_number' },
        { label: '流程名称', value: 'display_name' },
        { label: '所属部门', value: 'department_name' },
        { label: '流程类型', value: 'flow_type_name' },
        { label: '申请角色', value: 'apply_role_name' },
      ],
      likeKey: 'flow_number',

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
      return this.$store.dispatch(SYSTEM.PROCESS.INIT, qs)
    },
  },
}
</script>
