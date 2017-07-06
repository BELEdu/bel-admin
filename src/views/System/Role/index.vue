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
      <!--临时示例-->
      <Form-item>
        <Select v-model="query.equal.display_name">
          <Option value="公司总经理">公司总经理</Option>
          <Option value="校长">校长</Option>
        </Select>
      </Form-item>
      <!--临时示例-->
      <Form-item>
        <Row>
          <Col span="11">
            <Date-picker type="date" v-model="query.between.created_at[0]" placeholder="选择日期"></Date-picker>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
            <Date-picker type="date" v-model="query.between.created_at[1]" placeholder="选择日期"></Date-picker>
          </Col>
        </Row>
      </Form-item>

      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>角色管理</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/system/role/edit')">添加角色</Button>
      </Col>
    </Row>

    <Table
      class="app-table"
      :columns="columns"
      :data="list.data"
      border
      @on-sort-change="sort"
    ></Table>

    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>
  </div>
</template>

<script>
/**
 * 系统管理 - 角色管理
 * @author lmh
 * @version 2017-06-22
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { SYSTEM } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-system-role',

  mixins: [list],

  data() {
    return {
      likeKeys: [
        { label: '角色编号', value: 'role_number' },
        { label: '角色名称', value: 'display_name' },
        { label: '所属部门', value: 'department_id' },
      ],
      likeKey: 'display_name',
      query: {
        equal: {
          display_name: '',
        },
        between: {
          created_at: [null, null],
        },
      },

      columns: [
        { title: '序号', type: 'index', align: 'center', width: 50 },
        { title: '角色编号', key: 'role_number', align: 'center', sortable: 'custom' },
        { title: '角色名称', key: 'display_name', align: 'center' },
        { title: '所属部门', key: 'department_id', align: 'center', sortable: 'custom' },
        {
          title: '角色类型',
          key: 'role_type',
          align: 'center',
          render: (h, { row }) => h('span', row.role_type === 1 ? '系统定制' : '自定义'),
        },
        { title: '角色描述', key: 'description', align: 'center', width: 300 },
        {
          title: '操作',
          align: 'center',
          render: createButton([
            { text: '删除', type: 'error', isShow: ({ row }) => row.role_type === 2 },
            { text: '筛选', type: 'primary', click: this.filterByDisplayName },
            { text: '编辑', type: 'primary', click: this.goToEdit },
          ]),
        },
      ],
    }
  },

  computed: {
    ...mapState({
      list: state => state.system.role.list,
    }),
  },

  methods: {
    // 按角色名称筛选列表
    filterByDisplayName({ display_name }) {
      this.query.equal = { display_name }
      this.filter()
    },

    // 转跳到编辑页
    goToEdit({ id }) {
      this.$router.push(`/system/role/edit/${id}`)
    },

    // 获取列表数据
    getData(qs) {
      return this.$store.dispatch(SYSTEM.ROLE.INIT, qs)
    },
  },
}
</script>
