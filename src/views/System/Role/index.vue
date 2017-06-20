<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item prop="start">
        <Input v-model="query.like.display_name" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="filter">搜索</Button>
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
 * @version 2017-06-06
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { GLOBAL, SYSTEM } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-system-role',

  mixins: [list],

  data() {
    return {
      query: {
        like: {
          display_name: '',
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
            { text: '人员', type: 'primary' },
            {
              text: '编辑',
              type: 'primary',
              click: ({ id }) => this.$router.push(`/system/role/edit/${id}`),
            },
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
    getData(qs) {
      this.$router.push(`/system/role${qs}`)

      this.$store.dispatch(SYSTEM.ROLE.INIT, qs)
        .then(() => {
          this.$store.commit(GLOBAL.LOADING.HIDE)
        })
    },
  },
}
</script>

<style>

</style>
