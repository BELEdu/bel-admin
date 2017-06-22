<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Input placeholder="请输入关键字"></Input>
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

    <Table class="app-table" :columns="columns" :data="list.data" border></Table>

    <app-pager :data="list" @on-change="goTo"></app-pager>
  </div>
</template>

<script>
/**
 * 系统管理 - 用户管理
 * @author lmh
 * @version 2017-06-22 初步动态化
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { GLOBAL, SYSTEM } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-system-user',

  mixins: [list],

  data() {
    return {
      query: {},

      columns: [
        { title: '员工编号', key: 'user_number', align: 'center' },
        { title: '用户名', key: 'username', align: 'center' },
        { title: '姓名', key: 'realname', align: 'center' },
        { title: '手机号', key: 'mobile', align: 'center' },
        { title: '邮箱', key: 'email', align: 'center' },
        { title: '性别', key: 'gender', align: 'center' },
        { title: '部门角色', key: 'users_job_type', align: 'center' },
        { title: '岗位性质', key: 'users_job_type', align: 'center' },
        { title: '最近登录时间', key: 'updated_at', align: 'center' },
        { title: '状态', key: 'status', align: 'center' },
        {
          title: '操作',
          key: 11,
          align: 'center',
          width: 110,
          render: createButton([
            { text: '删除', type: 'error' },
            { text: '编辑', type: 'primary', click: row => this.$router.push(`/system/user/edit/${row.id}`) },
          ]),
        },
      ],
    }
  },

  computed: {
    ...mapState({
      list: state => state.system.user.list,
    }),
  },

  methods: {
    getData(qs) {
      this.$router.push(`/system/user${qs}`)

      this.$store.dispatch(SYSTEM.USER.INIT, qs)
        .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
    },
  },
}
</script>

<style>

</style>
